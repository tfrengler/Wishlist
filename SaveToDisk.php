<?php
	header('Content-Type: application/json;charset=UTF-8');
	header("Cache-Control: no-cache, must-revalidate");
	header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

	function CreateWish($Wish, $XMLObject) {

		$ReturnData = "";

		$SectionElement = "";
		$SectionData = "";
		$CurrentSectionName = "";
		$SingleLinkElement = "";
		$SingleLinkElementData = "";

		$ParentElement = $XMLObject->createElement('Wish');
		$ListOfWishSections = array('SortOrder','Picture','Description','Links');

		for ($i = 0; $i < count($ListOfWishSections); $i++) { 
			$CurrentSectionName = $ListOfWishSections[$i];

			$SectionElement = $XMLObject->createElement($CurrentSectionName);
			$ParentElement->appendChild($SectionElement);

			if ($CurrentSectionName == 'Links') {

				if (property_exists($Wish, "Links")) {

					for ($z = 0; $z < count($Wish->Links); $z++) {
						$CurrentLinkData = $Wish->Links[$z];

						$SingleLinkElement = $XMLObject->createElement('Link');
						$SingleLinkElementData = $XMLObject->createCDATASection($CurrentLinkData);
						$SingleLinkElement->appendChild($SingleLinkElementData);
						$SectionElement->appendChild($SingleLinkElement);
					};
				};
			}
			else {
				if (property_exists($Wish, $CurrentSectionName)) {
					$SectionData = $XMLObject->createCDATASection( $Wish->$CurrentSectionName );
					$SectionElement->appendChild($SectionData);
				};
			}
		};

		$ReturnData = $ParentElement;
		return $ReturnData;
	};

	$PostData = json_decode($_POST["RequestData"]);

	$ReturnData = array(
		"Status"=>"NOK",
		"Message"=>"Unknown"
	);

	if ($PostData != null) {

		$Wishes = $PostData->Wishlist;
		$XMLObject = new DOMDocument('1.0', 'UTF-8');

		$XMLObject->preserveWhiteSpace = false;
		$XMLObject->formatOutput = true;

		$FileName = "wishlist_" . $PostData->WishOwner;
		$envelope = $XMLObject->createElement('envelope');

		$XMLObject->appendChild($envelope);
		$CurrentWish = "";

		foreach ($Wishes as $CurrentWish) {

			$envelope->appendChild(CreateWish($CurrentWish, $XMLObject));
		};

		copy($FileName . ".xml", $FileName . "_backup.xml"); // Making a backup
		$XMLObject->saveXML();
		$XMLObject->save($FileName . ".xml");

		$ReturnData["Status"] = "OK";
		$ReturnData["Message"] = "Saved and backed up succesfully";
	}
	else {
		$ReturnData["Status"] = "NOK";
		$ReturnData["Message"] = "Cannot parse JSON data from variable RequestData!";
		http_response_code(500);
	};

	$EncodedReturnData = json_encode($ReturnData);
	echo $EncodedReturnData;

?>