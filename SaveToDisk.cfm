<cfprocessingdirective pageEncoding="utf-8" />
<cfoutput>

<cfset returnData = {
	Status: "",
	Message: ""
} />

<cfset wishes = deserializeJSON(FORM.Wishlist) />

<cfsavecontent variable="wishlistContent" >
	<?xml version="1.0" encoding="UTF-8"?>
	<envelope>

		<cfloop collection="#wishes#" item="wishIndex" >
			<cfset currentWish = wishes[wishIndex] />

			<Wish>
				<SortOrder><![CDATA[#currentWish.SortOrder#]]></SortOrder>
				<Picture><![CDATA[#currentWish.Picture#]]></Picture>
				<Description><![CDATA[#currentWish.Description#]]></Description>

				<cfif arrayLen(currentWish.Links) IS 0 >
					<Links/>
				<cfelse>
					<Links>
					<cfloop array="#currentWish.Links#" index="link" >
						<Link><![CDATA[#link#]]></Link>
					</cfloop>
					</Links>
				</cfif>
			</Wish>

		</cfloop>

	</envelope>
</cfsavecontent>

<cfset wishlistContent = REReplace(wishlistContent,"[\s]+(?![^><]*(?:>|<\/))", "", "All") />
<!--- <cfset wishlistContent = REReplace(wishlistContent, "\s", "ALL") /> --->
<cfset wishlistContent = toString(xmlParse(wishlistContent)) />

<cffile action="copy" source="wishlist_#FORM.wishOwner#.xml" destination="wishlist_#FORM.wishOwner#_backup.xml" charset="utf-8" nameconflict="overwrite" />
<cffile action="write" file="wishlist_#FORM.wishOwner#.xml" output="#toString(xmlParse(wishlistContent))#" charset="utf-8" nameconflict="overwrite" />

<cfset returnData.Status = "OK" />
<cfset returnData.Message = "Changes saved and backed up succesfully!" />

#serializeJSON(returnData)#

</cfoutput>