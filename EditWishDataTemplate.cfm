<cfprocessingdirective pageEncoding="utf-8" />
<cfoutput>

	<cfswitch expression="#FORM.Section#" >

		<cfcase value="Picture" >

			<cfsavecontent variable="TemplateOutput" >
				<div id='EditWishDataModal' title='PICTURE' >
					<img src='#encodeForHTMLAttribute(FORM.Data)#'>
					<br/><br/>
					<input name='EditData' type='text' value='#encodeForHTMLAttribute(FORM.Data)#' />
				</div>
			</cfsavecontent>

		</cfcase>

		<cfcase value="Description" >

			<cfsavecontent variable="TemplateOutput" >
				<div id='EditWishDataModal' title='DESCRIPTION' >
					<textarea name='EditData' >#FORM.Data#</textarea>
				</div>
			</cfsavecontent>

		</cfcase>

		<cfcase value="SortOrder" >

			<cfsavecontent variable="TemplateOutput" >
				<div id='EditWishDataModal' title='SORT ORDER' >
					<input name='EditData' type='number' min='0' max='100' value='#encodeForHTMLAttribute(FORM.Data)#' />
					<br/>
					<div>Minimum is 0 and max is 100.</div>
				</div>
			</cfsavecontent>

		</cfcase>

		<cfcase value="Links" >

			<cfset Link1 = "" />
			<cfset Link2 = "" />
			<cfset Link3 = "" />
			<cfset Link4 = "" />
			<cfset Link5 = "" />

			<cfif listLen(FORM.Data) GT 0 >
				<cfset Link1 = encodeForHTMLAttribute(listGetAt(FORM.Data, 1)) />
			</cfif>

			<cfif listLen(FORM.Data) GT 1 >
				<cfset Link2 = encodeForHTMLAttribute(listGetAt(FORM.Data, 2)) />
			</cfif>

			<cfif listLen(FORM.Data) GT 2 >
				<cfset Link3 = encodeForHTMLAttribute(listGetAt(FORM.Data, 3)) />
			</cfif>

			<cfif listLen(FORM.Data) GT 3 >
				<cfset Link4 = encodeForHTMLAttribute(listGetAt(FORM.Data, 4)) />
			</cfif>

			<cfif listLen(FORM.Data) GT 4 >
				<cfset Link5 = encodeForHTMLAttribute(listGetAt(FORM.Data, 5)) />
			</cfif>

			<cfsavecontent variable="TemplateOutput" >
				<div id='EditWishDataModal' title='LINKS' >
					<input name='EditData' type='text' value='#Link1#' /><br/>
					<input name='EditData' type='text' value='#Link2#' /><br/>
					<input name='EditData' type='text' value='#Link3#' /><br/>
					<input name='EditData' type='text' value='#Link4#' /><br/>
					<input name='EditData' type='text' value='#Link5#' />
				</div>
			</cfsavecontent>

		</cfcase>

	</cfswitch>

#toString(TemplateOutput)#
</cfoutput>