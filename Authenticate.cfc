<cfcomponent output="false" >
<cfprocessingdirective pageEncoding="utf-8"  />

	<cfset WishlistPassword = "643512352" />

	<cffunction name="GenerateAuthKey" access="private" returntype="struct" output="false" hint="" >
		
		<cfset var ReturnData = {
			Status: "NOK",
			Data: "",
			Errors: arrayNew(1)
		} />

		<cfset var DateValue = dateFormat(now(), "ddmmyyyy") />
		<cfset var AuthKey = hash(variables.WishlistPassword & DateValue, "MD5") />

		<cfset ReturnData.Status = "OK" />
		<cfset ReturnData.Data = AuthKey />

		<cfreturn ReturnData />
	</cffunction>

	<cffunction name="VerifyAuthKey" access="remote" returntype="struct" returnformat="JSON" output="false" hint="" >
		<cfargument name="ClientAuthKey" type="string" required="true" />

		<cfset var ReturnData = {
			Status: "",
			Data: "",
			Errors: arrayNew(1)
		} />

		<cfset var AuthKey = variables.GenerateAuthKey().data />

		<cfif arguments.ClientAuthKey IS AuthKey >
			<cfset ReturnData.Status = "OK" />
			<cfset ReturnData.Data = "Authorized" />
		<cfelse>
			<cfset ReturnData.Status = "NOK" />
			<cfset ReturnData.Data = "Not authorized" />
		</cfif>

		<cfreturn ReturnData />
	</cffunction>

	<cffunction name="Login" access="remote" returntype="struct" returnformat="JSON" output="false" hint="" >
		<cfargument name="Password" type="string" required="true" />

		<cfset var ReturnData = {
			Status: "",
			Data: "",
			Errors: arrayNew(1)
		} />

		<cfset GenerateAuthKeyResponse = "" />

		<cfif variables.WishlistPassword IS arguments.Password >

			<cfset GenerateAuthKeyResponse = variables.GenerateAuthKey() />
			<cfset ReturnData.Status = "OK" />
			<cfset ReturnData.Data = GenerateAuthKeyResponse.Data />

		<cfelse>
			<cfset ReturnData.Status = "NOK" />
			<cfset ReturnData.Data = "Wrong password" />
		</cfif>

		<cfreturn ReturnData />
	</cffunction>

</cfcomponent>