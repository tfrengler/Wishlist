<cfprocessingdirective pageEncoding="utf-8" />
<cfoutput>

<div class="ContainerForWish" id="Wish_#FORM.ID#">

	<div class="ContainerForWishItems" id="SortOrderContainer_#FORM.ID#" >
		<div id="SortOrderTooltip_#FORM.ID#" class="WishToolTip" >
			<div>
				CLICK TO EDIT
			</div>
		</div>

		<div id="SortOrder_#FORM.ID#" class="WishItems">
			#FORM.SortOrder#
		</div>
	</div>

	<div class="ContainerForWishItems" id="PictureContainer_#FORM.ID#"  >
		<div id="PictureTooltip_#FORM.ID#" class="WishToolTip" >
			<div>
				CLICK TO EDIT
			</div>
		</div>

		<cfif len(FORM.Picture) IS 0 >
			<cfset Picture = "Media/ImageNotFound.jpeg" />
		<cfelse>
			<cfset Picture = encodeForHTMLAttribute(FORM.Picture) />
		</cfif>

		<img onerror="Master.Lib.onPictureNotLoaded(this)" id="Picture_#FORM.ID#" src="#Picture#" class="WishItems">
	</div>

	<div class="ContainerForWishItems" id="DescriptionContainer_#FORM.ID#" >
		<div id="DescriptionTooltip_#FORM.ID#" class="WishToolTip" >
			<div>
				CLICK TO EDIT
			</div>
		</div>

		<div id="Description_#FORM.ID#" class="WishItems">
			#reReplace(FORM.Description, chr(10), "<br/>", "ALL")#
		</div>
	</div>

	<div class="ContainerForWishItems" id="LinksContainer_#FORM.ID#" >
		<div id="LinksTooltip_#FORM.ID#" class="WishToolTip" >
			<div>
				CLICK TO EDIT
			</div>
		</div>

		<div id="Links_#FORM.ID#" class="WishItems">
			<cfloop list="#FORM.Links#" index="currentLink" >
				<cfif len(currentLink) IS 0 >
					<cfcontinue/>
				</cfif>
				<a href="#encodeForHTMLAttribute(currentLink)#" target='_blank' >Link</a><br>
			</cfloop>
		</div>
	</div>

	<div class="ContainerForWishItems DeleteContainer" id="DeleteContainer_#FORM.ID#" >
		<img id="Delete_#FORM.ID#" src="Media/delete-big.png" class="WishItems">
	</div>
</div>

</cfoutput>