<?php 
	header('Content-Type: text/html;charset=UTF-8');
	header("Cache-Control: no-cache, must-revalidate");
	header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

	$PostData = json_decode($_POST["RequestData"]);

	if ($PostData != null) {

		try {
			switch ($PostData->Section) {
				case 'Picture':

					echo	"<div id='EditWishDataModal' title='PICTURE' >
							<img src='$PostData->Data'>
							<br/><br/>
							<input name='EditData' type='text' value='$PostData->Data' />
						</div>";
				break;

				case 'Description':

					echo	"<div id='EditWishDataModal' title='DESCRIPTION' >
							<textarea name='EditData' >$PostData->Data</textarea>
						</div>";
				break;

				case 'SortOrder':

					echo	"<div id='EditWishDataModal' title='SORT ORDER' >
							<input name='EditData' type='number' min='0' max='100' value='$PostData->Data' />
							<br/>
							<div>Minimum is 0 and max is 100.</div>
						</div>";
				break;

				case 'Links':

					$LinkData0 = "";
					$LinkData1 = "";
					$LinkData2 = "";
					$LinkData3 = "";
					$LinkData4 = "";

					for ($index = 0; $index < sizeof($PostData->Data); $index++) { 
						${"LinkData" . $index} = $PostData->Data[$index];
					};

					echo	"<div id='EditWishDataModal' title='LINKS' >
							<input name='EditData' type='text' value='$LinkData0' /><br/>
							<input name='EditData' type='text' value='$LinkData1' /><br/>
							<input name='EditData' type='text' value='$LinkData2' /><br/>
							<input name='EditData' type='text' value='$LinkData3' /><br/>
							<input name='EditData' type='text' value='$LinkData4' />
						</div>";
				break;
			};
		}
		catch(Exception $CatchError) {
			echo $CatchError;
			http_response_code(500);
		};

	} else {
		echo "Cannot parse JSON data from variable PostData!";
		http_response_code(500);
	}
?>