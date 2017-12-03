Master.Lib = {
	
	ChangeCSSRule: function(SelectorText, CSSRule, CSSValue) {
		var ReturnData = {
			Status: "NOK",
			Errors: []
		};

		var Stylesheet = document.styleSheets[0];
		var StylesheetRules = "";
		var AddCSSRule = "";
		var AddCSSRuleFormat = 0;
		var StyleRule = "";

		if (Stylesheet.cssRules) {
			StylesheetRules = Stylesheet.cssRules;
		}
		else if (Stylesheet.rules) {
			StylesheetRules = Stylesheet.rules;
		}

		if (Stylesheet.addRule) {
			AddCSSRuleFormat = 1;
			// Chrome
		}
		else if (Stylesheet.insertRule) {
			AddCSSRuleFormat = 2;
			// Firefox
		};

		var RuleToModifyAnchor = {};
		var FoundExistingStyle = false;
		var CatchError = "";

		try {

			for (StyleRule in StylesheetRules) {

				if (StylesheetRules[StyleRule].selectorText == SelectorText) {

					RuleToModifyAnchor = StylesheetRules[StyleRule];
					FoundExistingStyle = true;
					break;
				};
			};

			if (FoundExistingStyle == true) {
				RuleToModifyAnchor.style[CSSRule] = CSSValue;	
			}
			else if (FoundExistingStyle == false) {
				if (AddCSSRuleFormat == 1) {
					Stylesheet.addRule(SelectorText, CSSRule + ":" + CSSValue);
				}
				else if (AddCSSRuleFormat == 2) {
					var SelectorTextAndRule = SelectorText + "{" + CSSRule + ":" + CSSValue + "}";
					Stylesheet.insertRule(SelectorTextAndRule, StylesheetRules.length);
				};
			};

		}
		catch(CatchError) {
			ReturnData.Errors.push(CatchError);
			return ReturnData;
		};

		ReturnData.Status = "OK";
		return ReturnData;
	},

	HashString: function(StringToHash) {
		// http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
		var ReturnData = 0;
		var Hash = 0, index, Character, Length;

		if (typeof StringToHash == "undefined" && StringToHash.length == 0) {
			return ReturnData;
		};

		for (index = 0, Length = StringToHash.length; index < Length; index++) {

			Character = StringToHash.charCodeAt(index);
			Hash = ((Hash << 5) - Hash) + Character;
			Hash |= 0; // Convert to 32bit integer
		};

		ReturnData = Hash;
		return ReturnData;
	},

	TreatStringData: function(StringData, ToHTMLEntities, Trim) {
		if (typeof StringData == "undefined") {
			return false;
		};

		var ReturnData = StringData;

		if (typeof StringData != "string") {
			return ReturnData;
		};

		if (typeof ToHTMLEntities != "undefined" && ToHTMLEntities == true) {
			ReturnData = ReturnData.replace(/\"/g, "&#34;");
			ReturnData = ReturnData.replace(/'/g, "&#39;");
			ReturnData = ReturnData.replace(/</g, "&#60;");
			ReturnData = ReturnData.replace(/>/g, "&#62;");
		}
		else if (typeof ToHTMLEntities != "undefined" && ToHTMLEntities == false) {
			ReturnData = ReturnData.replace(/&#34;/g, "\"");
			ReturnData = ReturnData.replace(/&#39;/g, "'");
			ReturnData = ReturnData.replace(/&#60;/g, "<");
			ReturnData = ReturnData.replace(/&#62;/g, ">");
		};
		
		if (typeof Trim != "undefined" && Trim == true) {
			ReturnData = ReturnData.trim();
		};

		return ReturnData;
	},

	SecureJSinString: function(StringData, RemoveScriptTags, RemoveJSAttributes) {
		var ReturnData = StringData;
		var index = 0;

		var JSSensitiveKeywords = [
			"javascript:eval", 
			"onbeforeunload=", 
			"onerror=", 
			"onload=", 
			"onoffline=", 
			"ononline=", 
			"onpagehide=",
			"onpageshow=",
			"onresize=",
			"onunload=",
			"onblur=",
			"onchange=",
			"oncontextmenu=",
			"onfocus=",
			"oninput=",
			"oninvalid=",
			"onreset=",
			"onsearch=",
			"onselect=",
			"onsubmit=",
			"onkeydown=",
			"onkeypress=",
			"onkeyup=",
			"onclick=",
			"ondclick=",
			"onmousedown=",
			"onmousemove=",
			"onmouseout=",
			"onmouseover=",
			"onmouseup=",
			"onmousewheel=",
			"onscroll=",
			"onwheel=",
		];

		if (typeof StringData == "undefined" && StringData.length == 0) {
			return StringData;
		};

		if (typeof RemoveScriptTags != "undefined" && RemoveScriptTags == true) {
			ReturnData = ReturnData.replace(/<script[^>]*>/gi, "").replace(/<\/script[^>]*>/gi, "");
		};

		if (typeof RemoveJSAttributes != "undefined" && RemoveJSAttributes == true) {
			for (index; index < JSSensitiveKeywords.length; index++) {
				ReturnData = ReturnData.replace(new RegExp(JSSensitiveKeywords[index], "gi"), "");
			};
		};

		return ReturnData;
	},

	nl2br: function(StringData, WithTrailingSlash) {
		var BreakTag = (WithTrailingSlash || typeof WithTrailingSlash === 'undefined') ? '<br />' : '<br>';
		return (StringData + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + BreakTag + '$2');
	},

	onPictureNotLoaded: function(IMGElement) {
		IMGElement.src = "Media/ImageNotFound.jpeg";
	}
};