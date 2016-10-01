Master.Constructors.Views = {
	// Meant for inheritance
	Core: function() {

		this.ShowOrHideElement = function(AnchorName, ShowHide) {
			var HTMLElement = this.GetAnchorReference(AnchorName);

			if (ShowHide == "hide") {
				HTMLElement.style.display = "none";
			}
			else if (ShowHide == "show") {
				HTMLElement.style.display = "block";
			};
		};

		this.ChangeStyle = function(AnchorName, StyleName, Value) {
			var HTMLElement = this.GetAnchorReference(AnchorName);

			HTMLElement.style[StyleName] = Value;
		};

		this.GetAnchorReference = function(AnchorName) {
			var ReturnData = this.ViewAnchors[AnchorName];

			if (typeof ReturnData == "undefined") {
				ReturnData = "NOT FOUND";
			};

			return ReturnData;
		};

		this.SetAnchorReference = function(AnchorName, DOMReference) {
			var ReturnData = {
				Status: "NOK",
				Errors: []
			};
			var Status = "";
			var CatchError = "";

			if (typeof AnchorName == "string" && AnchorName.length > 0) {
				Status = "OK";
			}
			else {
				Status = "NOK";
				ReturnData.Errors.push("Parameter 'AnchorName' is not a string or is empty!");
			};

			if (typeof DOMReference == "string" && DOMReference.length > 0) {
				Status = "OK";
			}
			else {
				Status = "NOK";
				ReturnData.Errors.push("Parameter 'DOMReference' is not a string or is empty!");
			};

			try {	
				this.ViewAnchors[AnchorName] = document.getElementById(DOMReference);
				ReturnData.Status = "OK";
			}
			catch(CatchError) {
				ReturnData.Errors.push(CatchError);
			};

			return ReturnData;
		};

		this.RemoveAnchor = function(AnchorName) {
			delete this.ViewAnchors[AnchorName];
		};

		this.ChangeElementValue = function(AnchorName, NewValue) {
			var ReturnData = {
				Status: "NOK",
				Errors: []
			};

			var HTMLElement = this.GetAnchorReference(AnchorName);
			HTMLElement.value = NewValue;

			ReturnData.Status = "OK";
			return ReturnData;
		};

		this.ChangeElementInnerHTML = function(AnchorName, NewInnerHTMLData) {
			var ReturnData = {
				Status: "NOK",
				Errors: []
			};

			var HTMLElement = this.GetAnchorReference(AnchorName);
			HTMLElement.innerHTML = NewInnerHTMLData;

			ReturnData.Status = "OK";
			return ReturnData;
		};

		this.AppendElementInnerHTML = function(AnchorName, DataToAppend) {
			var ReturnData = {
				Status: "NOK",
				Errors: []
			};

			var HTMLElement = this.GetAnchorReference(AnchorName);
			HTMLElement.innerHTML += DataToAppend;

			ReturnData.Status = "OK";
			return ReturnData;
		};

		this.AppendDOMObjectToElement = function(AnchorName, DataToAppend) {
			var ReturnData = {
				Status: "NOK",
				Errors: []
			};

			var HTMLElement = this.GetAnchorReference(AnchorName);
			HTMLElement.appendChild(DataToAppend);

			ReturnData.Status = "OK";
			return ReturnData;
		};
	},
	/* Start of constructors for object instances */
	MainMenu: function() {

		this.ViewAnchors = {
			LoginButton: document.getElementById("SubmitLogin"),
			LoginCodeField: document.getElementById("Login"),
			SelectDifferentThemeField: document.getElementById("Theme"),
			ApplyNewThemeButton: document.getElementById("ApplyTheme"),
			Menu: document.getElementById("Menu"),
			WishlistCarlette: document.getElementById("WishlistCarlette"),
			WishlistThomas: document.getElementById("WishlistThomas")
		};

		this.EventHandlers = {
			OnLogin: function() {
				Master.Controllers.MainMenu.OnLogin(this);
			},
			OnLogout: function() {
				Master.Controllers.MainMenu.OnLogout(this);
			},
			OnLoadWishlist: function() {
				Master.Controllers.Wishes.OnLoadWishlist(this);
			}
		};

		this.InitEventHandlers = function() {
			this.GetAnchorReference("LoginButton").addEventListener("click", this.EventHandlers.OnLogin);
			this.GetAnchorReference("WishlistThomas").addEventListener("click", this.EventHandlers.OnLoadWishlist);
			this.GetAnchorReference("WishlistCarlette").addEventListener("click", this.EventHandlers.OnLoadWishlist);
		};

		this.GetLoginCode = function() {
			var PasswordElement = this.GetAnchorReference("LoginCodeField");
			var PasswordValue = PasswordElement.value;

			return PasswordValue;
		};

		this.ChangeLoginStatus = function(LoginStatus) {
			var PasswordField = this.GetAnchorReference("LoginCodeField");
			var LoginButton = this.GetAnchorReference("LoginButton");
			var LoginCodeFieldText = "";

			if (LoginStatus == "login") {
				var LoginButtonText = "LOG OUT";
				var PasswordFieldDisabled = true;

				LoginButton.removeEventListener("click", this.EventHandlers.OnLogin);
				LoginButton.addEventListener("click", this.EventHandlers.OnLogout);
			}
			else if (LoginStatus == "logout") {
				var LoginButtonText = "LOG IN";
				var PasswordFieldDisabled = false;

				LoginButton.removeEventListener("click", this.EventHandlers.OnLogout);
				LoginButton.addEventListener("click", this.EventHandlers.OnLogin);
			};

			PasswordField.disabled = PasswordFieldDisabled;
			this.ChangeElementValue("LoginCodeField", LoginCodeFieldText);
			this.ChangeElementValue("LoginButton", LoginButtonText);
		};
	},

	Wishes: function() {

		this.ViewAnchors = {

		};

		this.EventHandlers = {
			OpenEditDisplay: function() {
				Master.Controllers.Wishes.OnOpenEdit(this.nextElementSibling.id);
			},
			DeleteWish: function() {
				Master.Controllers.Wishes.OnDelete(this.id);
			}
		};

		this.GetWishData = function(Section, WishID) {

			var ReturnData = "";
			var Value = "";

			if (!arguments[0] && !arguments[1]) {
				console.log("One of the arguments for Views.Wishes.GetWishData() is undefined!");
				return false;
			};

			var Element = document.querySelector("#" + Section + "_" + WishID);

			if (Section == "Picture") {
				Value = Element.src.trim();
			}
			else if (Section == "Links") {
				var LinkElements = Element.getElementsByTagName("a");
				Value = [];
				var index = 0;

				for (index; index < LinkElements.length; index++) {
					Value.push( LinkElements[index].href.trim() );
				};
			}
			else {
				var Value = Element.textContent.trim();
			};

			ReturnData = Value;
			return ReturnData;
		};

		this.RemoveWish = function(WishID) {
			var ReturnData = {
				Status: "NOK",
				Error: []
			};

			var CatchError = "";
			var WishCollectionContainer = Master.Views.CenterSection.ViewAnchors["CenterSection"];
			var WishElement = this.GetAnchorReference(WishID);

			if (WishElement == "NOT FOUND") {
				ReturnData.Errors.push("Views.Wishes.RemoveWish() -> AnchorReference not found: " + WishID);
				return ReturnData;
			};

			try {
				WishCollectionContainer.removeChild(WishElement);	
			}
			catch(CatchError) {
				ReturnData.Errors.push(CatchError);
				return ReturnData;
			};
			
			this.RemoveAnchor(WishID);

			ReturnData.Status = "OK";

			return ReturnData;
		};

		this.ShowHideTooltips = function(ShowHide) {
			if (ShowHide == "show") {
				Master.Lib.ChangeCSSRule(".WishToolTip", "display", "table");
			}
			else if (ShowHide == "hide") {
				Master.Lib.ChangeCSSRule(".WishToolTip", "display", "none");
			};
		};

		this.ShowHideEditOnlyColumns = function(ShowHide) {
			if (ShowHide == "show") {
				Master.Lib.ChangeCSSRule("div[id^='DeleteContainer']", "display", "inline-block");
				Master.Lib.ChangeCSSRule("div[id^='SortOrderContainer']", "display", "inline-block");
			}
			else if (ShowHide == "hide") {
				Master.Lib.ChangeCSSRule("div[id^='DeleteContainer']", "display", "none");
				Master.Lib.ChangeCSSRule("div[id^='SortOrderContainer']", "display", "none");
			};
		};

		this.AddTooltipEventHandler = function(WishID) {
			var index = 0;

			if (WishID) {
				var SingleWishElement = this.GetAnchorReference(WishID);
				var SingleWishTooltips = SingleWishElement.getElementsByClassName("WishToolTip");

				for (index; index < SingleWishTooltips.length; index++) {
					SingleWishTooltips[index].addEventListener("click", this.EventHandlers.OpenEditDisplay);
				};
			}
			else {
				var WishToolTipElements = document.getElementsByClassName("WishToolTip");

				for (index; index < WishToolTipElements.length; index++) {
					WishToolTipElements[index].addEventListener("click", this.EventHandlers.OpenEditDisplay);
				};	
			};
		};

		this.AddDeleteEventHandler = function(WishID) {
			var index = 0;

			if (WishID) {
				var SingleWishElement = this.GetAnchorReference(WishID);
				var SingleWishDeleteElement = SingleWishElement.getElementsByClassName("DeleteContainer")[0];

				SingleWishDeleteElement.addEventListener("click", this.EventHandlers.DeleteWish);
			}
			else {
				var WishDeleteElement = document.getElementsByClassName("DeleteContainer");

				for (index; index < WishDeleteElement.length; index++) {
					WishDeleteElement[index].addEventListener("click", this.EventHandlers.DeleteWish);
				};
			};
		};

		this.UpdateWishData = function(WishID, SectionName, Data) {

			var ElementID = SectionName + "_" + WishID;
			var WishElement = document.getElementById(ElementID);
			var index = 0;
			var NewAnchorElement = {};
			var NewLineBreakElement = {};
			var TreatedData = "";

			if (SectionName == "Links" && Data instanceof Array) {
				WishElement.innerHTML = "";

				for (index; index < Data.length; index++) {

					NewLineBreakElement = document.createElement("br");
					NewAnchorElement = document.createElement("a");
					NewAnchorElement.innerHTML = "Link";
					NewAnchorElement.setAttribute("target", "_blank");
					NewAnchorElement.setAttribute("href", Data[index]);

					WishElement.appendChild(NewAnchorElement);
					WishElement.appendChild(NewLineBreakElement);
				};
			}
			else if (typeof Data == "string" && SectionName != "Picture") {
				TreatedData = Master.Lib.TreatStringData(Data, true, true);
				TreatedData = Master.Lib.nl2br(Data, true);
				WishElement.innerHTML = TreatedData;
			}
			else if (typeof Data == "string" && SectionName == "Picture") {
				WishElement.src = Data;
			};
		};
	},

	HelpSection: function() {

		this.ViewAnchors = {
			ExpandOrShrinkButton: document.getElementById("HelpExpandLink"),
			ExpandedHelp: document.getElementById("expandedHelp")
		};

		this.InitEventHandlers = function() {
			this.GetAnchorReference("ExpandOrShrinkButton").addEventListener("click", function() {
				Master.Controllers.HelpSection.OnExpandOrShrinkHelp(this);
			});
		};
	},

	HeaderSection: function() {

		this.ViewAnchors = {
			HideShowMenuButton: document.getElementById("MenuButton"),
			WishlistPerson: document.getElementById("WishlistPerson"),
			ToggleEditButton: document.getElementById("ToggleEdit"),
			SaveToDiskButton: document.getElementById("SaveButton"),
			AddNewWishButton: document.getElementById("AddButton")
		};

		this.EventHandlers = {
			EnableEditing: function() {
				Master.Controllers.HeaderSection.OnEnableEdit(this);
			},
			DisableEditing: function() {
				Master.Controllers.HeaderSection.OnDisableEdit(this);
			},
			AddWish: function() {
				Master.Controllers.HeaderSection.OnAddNewWish(this);	
			},
			SaveToDisk: function() {
				Master.Controllers.HeaderSection.OnSaveToDisk();
			}
		};

		this.InitEventHandlers = function() {
			this.GetAnchorReference("HideShowMenuButton").addEventListener("click", function() {
				Master.Controllers.HeaderSection.OnHideShowMenu(this);
			});
			this.GetAnchorReference("ToggleEditButton").addEventListener("click", this.EventHandlers.EnableEditing);
			this.GetAnchorReference("AddNewWishButton").addEventListener("click", this.EventHandlers.AddWish);
			this.GetAnchorReference("SaveToDiskButton").addEventListener("click", this.EventHandlers.SaveToDisk);
		};

		this.DisplayWishlistOwner = function(Who) {
			var UpperCaseWho = Who.toUpperCase();
			this.ChangeElementInnerHTML("WishlistPerson", UpperCaseWho);
		};
	},

	WishHeaders: function() {

		this.ViewAnchors = {

		};

		this.CreateHeaders = function(ListOfHeaders) {
			var ReturnData = {
				Status: "NOK",
				Errors: [],
				Data: {}
			};
			var i = 0;
			var Status = "";

			if  (ListOfHeaders instanceof Array) {
				if (ListOfHeaders.length > 0) {
					Status = "OK";
				}
				else {
					Status = "NOK";
					ReturnData.Errors.push("Parameter 'ListOfHeaders' is an array as expected but is empty!");
				};
			}
			else {
				Status = "NOK";
				ReturnData.Errors.push("Parameter 'ListOfHeaders' is not an Array!");
			};

			var Container = document.createElement("div");
			Container.setAttribute("id", "HeaderTitlesContainer");
			var HeaderElement = "";

			if (Status == "OK") {
				for (i = 0; i < ListOfHeaders.length; i++) {
					HeaderElement = document.createElement("div");
					HeaderElement.setAttribute("class", "HeaderTitles");
					HeaderElement.setAttribute("id", ("Header" + ListOfHeaders[i]));

					HeaderElement.innerHTML = ListOfHeaders[i].toUpperCase();
					Container.appendChild(HeaderElement);
					HeaderElement = "";
				};

				ReturnData.Status = "OK";
				ReturnData.Data = Container;
			};

			return ReturnData;
		};

		this.RenderHeaders = function(ListOfHeaders) {
			var ReturnData = {
				Status: "NOK",
				Errors: []
			};

			var CreateHeadersRet = this.CreateHeaders(ListOfHeaders);
			if (CreateHeadersRet.Status == "OK") {
				Master.Views.CenterSection.AppendDOMObjectToElement("CenterSection", CreateHeadersRet.Data);
			}
			else if (CreateHeadersRet.Status == "OK") {
				ReturnData.Errors.push(CreateHeadersRet.Errors);
				return ReturnData;
			};

			ReturnData.Status = "OK";
			return ReturnData;
		};
	},

	CenterSection: function() {

		this.ViewAnchors = {
			CenterSection: document.getElementById("CenterSection")
		};

		this.Clear = function()  {
			var ReturnData = {
				Status: "NOK",
				Errors: []
			};

			this.ChangeElementInnerHTML("CenterSection", "");
			ReturnData.Status = "OK";

			return ReturnData;
		};

		this.RenderWishes = function(Data, Singular) {
			var ReturnData = {
				Status: "NOK",
				Errors: []
			};

			var i = 0;
			var AppendElementInnerHTMLReturn = {};
			var SetAnchorReferenceReturn = {};
			if (!arguments[1]) {
				var Singular = false;	
			};

			if (Singular == false) {

				var SortedListOfWishesAsHTMLText = Data.sort(this.CompareSortOrder);

				for (i = 0; i < SortedListOfWishesAsHTMLText.length; i++) {

					AppendElementInnerHTMLReturn = this.AppendElementInnerHTML("CenterSection", SortedListOfWishesAsHTMLText[i].WishHTML);
					if (AppendElementInnerHTMLReturn.Status == "NOK") {
						ReturnData.Errors.push(AppendElementInnerHTMLReturn.Errors);
						return ReturnData;
					};
				};

				for (i = 0; i < SortedListOfWishesAsHTMLText.length; i++) {

					SetAnchorReferenceReturn = Master.Views.Wishes.SetAnchorReference(SortedListOfWishesAsHTMLText[i].DOMWishID, SortedListOfWishesAsHTMLText[i].DOMWishID);
					if (SetAnchorReferenceReturn.Status == "NOK") {
						ReturnData.Errors.push(SetAnchorReferenceReturn.Errors);
						return ReturnData;
					};
				};

				Master.Views.Wishes.AddTooltipEventHandler();
				Master.Views.Wishes.AddDeleteEventHandler();
			}
			else if (Singular == true) {
				/* 
					Unfortunately, assignment to innerHTML causes the destruction of all child elements, even if you're trying to append. 
					If you want to preserve child nodes (and their event handlers), you'll need to use DOM functions, such as appendChild().
				*/
				var NewWishID = Data[0].DOMWishID;
				var NewWishHTMLAsText = Data[0].WishHTML;

				var NewWishTempParent = document.createElement("div");
				NewWishTempParent.innerHTML = NewWishHTMLAsText;
				var NewWishAsDOMObject = NewWishTempParent.children[0];

				AppendDOMObjectToElementReturn = this.AppendDOMObjectToElement("CenterSection", NewWishAsDOMObject);
				SetAnchorReferenceReturn = Master.Views.Wishes.SetAnchorReference(NewWishID, NewWishID);

				Master.Views.Wishes.AddTooltipEventHandler(NewWishID);
				Master.Views.Wishes.AddDeleteEventHandler(NewWishID);
			};

			ReturnData.Status = "OK";
			return ReturnData;
		};

		this.CompareSortOrder = function(a,b) {
			if (a.SortOrder < b.SortOrder) {
				return -1;
			}
			else if (a.SortOrder > b.SortOrder) {
				return 1;
			}
			else {
				return 0;
			}
		};

		this.InitEventHandlers = function() {

		};
	},
	/* End of constructors of object instances */

	// To be executed upon loading of DOM
	Init: function() {
		Master.Views.HelpSection = new Master.Constructors.Views.HelpSection();
		Master.Views.HelpSection.InitEventHandlers();
		Master.Views.HeaderSection = new Master.Constructors.Views.HeaderSection();
		Master.Views.HeaderSection.InitEventHandlers();
		Master.Views.MainMenu = new Master.Constructors.Views.MainMenu();
		Master.Views.MainMenu.InitEventHandlers();
		Master.Views.Wishes = new Master.Constructors.Views.Wishes();
		Master.Views.CenterSection = new Master.Constructors.Views.CenterSection();
		Master.Views.WishHeaders = new Master.Constructors.Views.WishHeaders();
	}
};
/* Inheritance */
Master.Constructors.Views.MainMenu.prototype = new Master.Constructors.Views.Core();
Master.Constructors.Views.HelpSection.prototype = new Master.Constructors.Views.Core();
Master.Constructors.Views.HeaderSection.prototype = new Master.Constructors.Views.Core();
Master.Constructors.Views.WishHeaders.prototype = new Master.Constructors.Views.Core();
Master.Constructors.Views.Wishes.prototype = new Master.Constructors.Views.Core();
Master.Constructors.Views.CenterSection.prototype = new Master.Constructors.Views.Core();
Master.Constructors.Views.WishHeaders.prototype = new Master.Constructors.Views.Core();