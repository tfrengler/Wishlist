<?php
	header('Content-Type: application/JSON;charset=UTF-8');
	header("Cache-Control: no-cache, must-revalidate");
	header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

class Authentication {

	private $WishlistPassword = "643512352";

	private function GenerateAuthKey() {
		$ReturnData = array(
			"Status"=>"NOK",
			"Data"=>"",
			"Errors"=>array()
		);

		$DateValue = date("Ymd");
		$StringToUseForHash = $DateValue . $this->WishlistPassword;
		$AuthKey = hash("md5", $StringToUseForHash);

		$ReturnData["Status"] = "OK";
		$ReturnData["Data"] = $AuthKey;

		return $ReturnData;
	}

	public function VerifyAuthKey($ClientAuthKey) {
		$ReturnData = array(
			"Status"=>"NOK",
			"Data"=>"",
			"Errors"=>array()
		);

		$GenerateAuthKeyRet = $this->GenerateAuthKey();

		if ($GenerateAuthKeyRet["Status"] == "NOK") {
			array_push($ReturnData["Errors"], $GenerateAuthKeyRet["Errors"]);
			return $ReturnData;
		};

		if ($GenerateAuthKeyRet["Data"] == $ClientAuthKey) {
			$ReturnData["Status"] = "OK";
			$ReturnData["Data"] = "Authorized";
		}
		else {
			$ReturnData["Status"] = "OK";
			$ReturnData["Data"] = "Not authorized";	
		};

		return $ReturnData;
	}

	public function Login($Password) {
		$ReturnData = array(
			"Status"=>"NOK",
			"Data"=>"",
			"Errors"=>array()
		);

		if ($this->WishlistPassword == $Password) {
			$AuthKeyRet = $this->GenerateAuthKey($Password);

			if ($AuthKeyRet["Status"] == "NOK") {
				array_push($ReturnData["Errors"], $AuthKeyRet["Errors"]);
			}
			elseif ($AuthKeyRet["Status"] == "OK") {
				$ReturnData["Data"] = $AuthKeyRet["Data"];
				$ReturnData["Status"] = "OK";
			};
		}
		else {
			$ReturnData["Status"] = "OK";
			$ReturnData["Data"] = "Wrong password";
		}

		return $ReturnData;
	}	
};

$Auth = new Authentication();
$PostData = json_decode($_POST["RequestData"]);

$ReturnData = array(
	"Status"=>"",
	"Message"=>""
);

if ($PostData != null) {

	if ($PostData->Action == "Login") {
		$LoginRet = $Auth->Login($PostData->Parameter);
		
		if ($LoginRet["Status"]== "OK") {

			if ($LoginRet["Data"] == "Wrong password") {
				$ReturnData["Status"] = "NOK";
			}
			else {
				$ReturnData["Status"] = "OK";
			}
			$ReturnData["Message"] = $LoginRet["Data"];
		}
		elseif ($LoginRet["Status"] == "NOK") {

			$ReturnData["Status"] = "NOK";
			$ReturnData["Message"] = $LoginRet["Errors"][0];
			http_response_code(500);
		};
	};

	if ($PostData->Action == "Verify") {
		$VerifyAuthKeyRet = $Auth->VerifyAuthKey($PostData->Parameter);
		
		if ($VerifyAuthKeyRet["Status"]== "OK") {

			if ($VerifyAuthKeyRet["Data"] == "Not authorized") {
				$ReturnData["Status"] = "NOK";
			}
			else {
				$ReturnData["Status"] = "OK";
			}
			$ReturnData["Message"] = $VerifyAuthKeyRet["Data"];
		}
		elseif ($VerifyAuthKeyRet["Status"] == "NOK") {

			$ReturnData["Status"] = "NOK";
			$ReturnData["Message"] = $VerifyAuthKeyRet["Errors"][0];
			http_response_code(500);
		};
	};
}
else {
	$ReturnData["Status"] = "NOK";
	$ReturnData["Message"] = "Cannot parse JSON data from variable RequestData!";
	http_response_code(500);
};

$EncodedReturnData = json_encode($ReturnData);
echo $EncodedReturnData;

?>