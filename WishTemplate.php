<?php 
	header('Content-Type: text/html;charset=UTF-8');
	header("Cache-Control: no-cache, must-revalidate");
	header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

	$PostData = json_decode($_POST["RequestData"]);

	if ($PostData != null) {

	try {
?>
<div class="ContainerForWish" id="Wish_<?= $PostData->ID ?>">

	<div class="ContainerForWishItems" id="SortOrderContainer_<?= $PostData->ID ?>" >
		<div id="SortOrderTooltip_<?= $PostData->ID ?>" class="WishToolTip" >
			<div>
				CLICK TO EDIT
			</div>
		</div>

		<div id="SortOrder_<?= $PostData->ID ?>" class="WishItems">
			<?= $PostData->SortOrder; ?>
		</div>
	</div>

	<div class="ContainerForWishItems" id="PictureContainer_<?= $PostData->ID ?>"  >
		<div id="PictureTooltip_<?= $PostData->ID ?>" class="WishToolTip" >
			<div>
				CLICK TO EDIT
			</div>
		</div>

		<img id="Picture_<?= $PostData->ID ?>" src="<?= $PostData->Picture; ?>" class="WishItems">
	</div>

	<div class="ContainerForWishItems" id="DescriptionContainer_<?= $PostData->ID ?>" >
		<div id="DescriptionTooltip_<?= $PostData->ID ?>" class="WishToolTip" >
			<div>
				CLICK TO EDIT
			</div>
		</div>

		<div id="Description_<?= $PostData->ID ?>" class="WishItems">
			<?= nl2br($PostData->Description); ?>
		</div>
	</div>

	<div class="ContainerForWishItems" id="LinksContainer_<?= $PostData->ID ?>" >
		<div id="LinksTooltip_<?= $PostData->ID ?>" class="WishToolTip" >
			<div>
				CLICK TO EDIT
			</div>
		</div>

		<div id="Links_<?= $PostData->ID ?>" class="WishItems">
			<?php
			for ($x = 0; $x < sizeof($PostData->Links); $x++) {
			?>
				<a href="<?= $PostData->Links[$x]; ?>" target='_blank' >Link</a><br>
			<?php
			}
			?>
		</div>
	</div>

	<div class="ContainerForWishItems DeleteContainer" id="DeleteContainer_<?= $PostData->ID ?>" >
		<img id="Delete_<?= $PostData->ID ?>" src="Media/delete-big.png" class="WishItems">
	</div>
</div> 
<?php
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