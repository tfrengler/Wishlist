Master.Constructors.Controllers = {

	Wishes: function() {

		this.OnLoadWishlist = function(CallingHTMLElement) {

			var WislistBelongsTo = CallingHTMLElement.innerHTML.toLowerCase();

			var LoadWishlistReturn = Master.State.Wishes.Load(WislistBelongsTo);
			if (LoadWishlistReturn.Status == "NOK") {
				var Exception = new Master.Constructors.Models.ErrorHandler();
				Exception.Run(LoadWishlistReturn.Errors, "Wishes.OnLoadWishlist() calling State.Wishes.Load()");
				return false;
			};

			var RenderWishlistReturn = Master.Controllers.CenterSection.RenderWishlist();
			var OnRenderWishlistRet = Master.Controllers.HeaderSection.OnRenderWishlist();
		};

		this.OnLogin = function() {
			Master.Views.Wishes.ShowHideEditOnlyColumns("show");
		};

		this.OnLogout = function() {
			Master.Views.Wishes.ShowHideEditOnlyColumns("hide");
		};

		this.OnEnableEdit = function() {
			Master.Views.Wishes.ShowHideTooltips("show");
		};

		this.OnDisableEdit = function() {
			Master.Views.Wishes.ShowHideTooltips("hide");
		};

		this.OnOpenEdit = function(CallerID) {

			if (!arguments[0]) {
				console.log("CallerID in OnOpenEdit() is undefined!");
				return false;
			};

			var WishID = CallerID.slice(CallerID.lastIndexOf("_") + 1);
			var Section = CallerID.slice(0, CallerID.lastIndexOf("_"));

			var PostData = {};
			var BackendWishID = "Wish_" + WishID;
			var BackendWish = Master.State.Wishes.GetWishByID(BackendWishID).Data;

			PostData.Section = Section;
			PostData.Data = BackendWish["Get" + Section]();

			var BackendRequest = new Master.Constructors.Models.BackendRequest();
			var BackendRequestReturn = BackendRequest.Load("EditWishDataTemplate.cfm", PostData, "application/x-www-form-urlencoded");

			if (BackendRequestReturn.Status == "NOK") {
				console.log("OnOpenEdit() calling EditWishDataTemplate.cfm via BackendRequest() has failed apparently!");
				return false;
			};

			$("#WishEditDialog").html(BackendRequestReturn.Data.Response);

			var DialogWidth = 300;

			if (Section == "Picture") {
				var PictureElementWidth = $("#" + Section + "_" + WishID).prop("naturalWidth");

				if (typeof PictureElementWidth != "undefined") {
					DialogWidth = PictureElementWidth + 20;
				};

				if (DialogWidth < 300) {
					DialogWidth = 300;
				};
			};

			$("#WishEditDialog").dialog({
				buttons: [
				{
					text: "Save",
					click: function() {
						Master.Controllers.Wishes.OnSave(WishID, Section);
					}
				},
				{
					text: "Cancel",
					click: function() {
						Master.Controllers.Wishes.OnExitEdit();
					}
				}
				],
				modal: true,
				title: Section,
				width: DialogWidth
			});
		};

		this.OnExitEdit = function() {

			$("#WishEditDialog").html("close");
			$("#WishEditDialog").html("");
			$("#WishEditDialog").dialog("destroy");

		};

		this.OnSave = function(WishID, Section) {

			var index = 0;
			var EditedData = "";
			var DataEditElements = document.getElementsByName("EditData");
			var LinkValue = "";

			switch(Section) {
				case "Links":
					EditedData = [];
					for (index; index < DataEditElements.length; index++) {

						LinkValue = DataEditElements[index].value;

						if (typeof LinkValue != 'undefined' && LinkValue.length > 0) {
							EditedData.push( LinkValue );
						};
					};
					break;

				default:
					EditedData = DataEditElements[0].value;
					break;
			};

			Master.Controllers.Wishes.OnExitEdit();

			var BackendWishID = "Wish_" + WishID;
			var GetWishByIDRet = Master.State.Wishes.GetWishByID(BackendWishID);

			if (GetWishByIDRet.Status == "NOK") {
				console.log("Controller.OnSave()->GetWishByID(): ");
				console.log(GetWishByIDRet.Errors);
				return false;
			};

			var BackendWish = GetWishByIDRet.Data;
			BackendWish["Set" + Section](EditedData); // Update the wish in memory
			var UpdatedData = BackendWish["Get" + Section]();

			Master.Views.Wishes.UpdateWishData(WishID, Section, UpdatedData); // Update the view
		};

		this.OnDelete = function(CallerID) {
			var Confirmation = window.confirm("Are you sure you want to delete this wish?");
			
			if (Confirmation == false) {
				return true;
			};

			var WishID = "Wish_" + CallerID.slice(CallerID.lastIndexOf("_") + 1);
			var DeleteWishReturn = Master.State.Wishes.DeleteWish(WishID);
			
			if (DeleteWishReturn.Status == "NOK") {
				console.log(DeleteWishReturn.Errors);
				return false;
			};

			var RemoveWishReturn = Master.Views.Wishes.RemoveWish(WishID);
			if (RemoveWishReturn.Status == "NOK") {
				console.log(RemoveWishReturn.Errors);
				return false;
			};

			return true;
		};

		this.GenerateViewForWish = function(WishID) {
			var ReturnData = {
				Data: {},
				Status: "NOK"
			};

			var WishModel = Master.State.Wishes.GetWishByID(WishID);
			var TemplatePostData = WishModel.Data;

			var BackendRequest = new Master.Constructors.Models.BackendRequest();
			var BackendRequestReturn = BackendRequest.Load("WishTemplate.cfm", TemplatePostData, "application/x-www-form-urlencoded");

			if (BackendRequestReturn.Status == "NOK" || BackendRequestReturn.Data.ResponseText == "NOK") {
				var Exception = new Master.Constructors.Models.ErrorHandler();
				Exception.Run(BackendRequestReturn.Errors, "Wishes.GenerateViewForWish() calling Constructors.Models.BackendRequest()", TemplatePostData);
				return ReturnData;
			};

			ReturnData.Data = BackendRequestReturn.Data.ResponseText;
			ReturnData.Status = "OK";

			return ReturnData;
		};
	},

	WishHeaders: function() {

	},

	CenterSection: function() {

			this.Clear = function() {
				Master.Views.CenterSection.Clear();
			};

			this.RenderHeaders = function() {
				var ReturnData = false;

				var ListOfHeaders = ["Picture", "Description", "Links"];
				var VerifyAuthenticationRet = Master.State.Authentication.VerifyAuthentication();

				if (VerifyAuthenticationRet.Data == true) {
					ListOfHeaders = ["Sort Order", "Picture", "Description", "Links", "Delete"];
				};

				var RenderHeadersRet = Master.Views.WishHeaders.RenderHeaders(ListOfHeaders);
				if (RenderHeadersRet.Status == "NOK") {
					return ReturnData;
				}
				else if (RenderHeadersRet.Status == "OK") {
					ReturnData = true;
				};

				return ReturnData;
			};

			this.RenderWishlist = function() {
				var ReturnData = false;

				this.Clear();
				this.RenderHeaders();

				var GetListOfWishesReturn = Master.State.Wishes.GetListOfWishes();
				var ListOfWishes = [];
				var Wish = "";
				var WishID = 1;
				var GenerateViewForWishRet = {};
				var i = 0;

				if (GetListOfWishesReturn.Status == "NOK") {
					var Exception = new Master.Constructors.Models.ErrorHandler();
					Exception.Run(GetListOfWishesReturn.Errors, "CenterSection.RenderWishlist() calling State.Wishes.GetListOfWishes()");
					return false;
				};

				for (Wish in GetListOfWishesReturn.Data) {

					GenerateViewForWishRet = Master.Controllers.Wishes.GenerateViewForWish(Wish);

					if (GenerateViewForWishRet.Status == "NOK") {
						var Exception = new Master.Constructors.Models.ErrorHandler();
						Exception.Run(GetListOfWishesReturn.Errors, "CenterSection.RenderWishlist() calling Wishes.GenerateViewForWishRet()");
						return false;
					};

					ListOfWishes.push(
						{
							"DOMWishID": Wish,
							"SortOrder": GetListOfWishesReturn.Data[Wish].SortOrder,
							"WishHTML": GenerateViewForWishRet.Data
						}
					);

				};

				Master.Views.CenterSection.RenderWishes(ListOfWishes);

				ReturnData = true;
				return ReturnData;
			};

			this.OnLogin = function() {
				if (Master.State.Wishes.GetWhoWishesBelongTo().length > 0) {
					this.RenderWishlist();
				};
			};

			this.OnLogout = function() {
				if (Master.State.Wishes.GetWhoWishesBelongTo().length > 0) {
					Master.State.Wishes.RemoveEmptyWishes();
					this.RenderWishlist();
				};
			};

			this.OnAddNewWish = function() {

				var EmptyWish = Master.State.Wishes.BuildWish();
				Master.State.Wishes.InsertNewWish(EmptyWish.Data);

				var GetAmountOfWishesRet = Master.State.Wishes.GetAmountOfWishes();
				var WishID = "Wish_" + GetAmountOfWishesRet.Data;
				var GetWishByIDRet = Master.State.Wishes.GetWishByID(WishID);

				var GenerateViewForWishRet = Master.Controllers.Wishes.GenerateViewForWish(WishID);
				if (GenerateViewForWishRet.Status == "NOK") {
					var Exception = new Master.Constructors.Models.ErrorHandler();
					Exception.Run(GetListOfWishesReturn.Errors, "CenterSection.OnAddNewWish() calling Wishes.GenerateViewForWishRet()");
					return false;
				};

				var NewWish = [];

				NewWish.push(
					{
						"DOMWishID": WishID,
						"SortOrder": GetWishByIDRet.Data.SortOrder,
						"WishHTML": GenerateViewForWishRet.Data
					}
				);

				Master.Views.CenterSection.RenderWishes(NewWish, true);
			};
	},

	MainMenu: function() {
		
		this.OnLogin = function(CallingHTMLElement) {
		
			var LoginCode = Master.Views.MainMenu.GetLoginCode();
			if (LoginCode.length == 0) {
				window.alert("Please enter a password before trying to log in!");
				return false;
			};

			var LoginReturn = Master.State.Authentication.Login(LoginCode);

			if (LoginReturn.Status == "NOK") {
				var Exception = new Master.Constructors.Models.ErrorHandler();
				Exception.Run(LoginReturn.Errors, "MainMenu.OnLogin() calling State.Authentication.Login()", LoginCode);
				return false;
			};

			if (LoginReturn.Data.length > 0) {
				window.alert(LoginReturn.Data);
				return false;
			};

			Master.Views.MainMenu.ChangeLoginStatus("login");

			Master.Controllers.CenterSection.OnLogin();
			Master.Controllers.Wishes.OnLogin();
			Master.Controllers.HeaderSection.OnLogin();
		};

		this.OnLogout = function(CallingHTMLElement) {
			Master.State.Authentication.Logout();

			Master.Views.MainMenu.ChangeLoginStatus("logout");

			Master.Controllers.CenterSection.OnLogout();
			Master.Controllers.Wishes.OnLogout();
			Master.Controllers.HeaderSection.OnLogout();
		};
	},

	HelpSection: function() {

		this.OnExpandOrShrinkHelp = function(CallingHTMLElement) {
			var HelpSectionElement = Master.Views.HelpSection.GetAnchorReference("ExpandedHelp");

			if (HelpSectionElement.style.display == "none" || HelpSectionElement.style.display == "")  {
				Master.Views.HelpSection.ShowOrHideElement("ExpandedHelp", "show");
			}
			else if (HelpSectionElement.style.display == "block") {
				Master.Views.HelpSection.ShowOrHideElement("ExpandedHelp", "hide");
			};
		};
	},

	HeaderSection: function() {

		this.OnHideShowMenu = function(CallingHTMLElement) {
			var MenuHTMLElement = Master.Views.MainMenu.GetAnchorReference("Menu");

			if (MenuHTMLElement.style.display == "none")  {
				Master.Views.MainMenu.ShowOrHideElement("Menu", "show");
				Master.Views.HeaderSection.ChangeElementInnerHTML("HideShowMenuButton", "<p>HIDE MAIN MENU</p>");
			}
			else if (MenuHTMLElement.style.display == "block" || MenuHTMLElement.style.display == "") {
				Master.Views.MainMenu.ShowOrHideElement("Menu", "hide");
				Master.Views.HeaderSection.ChangeElementInnerHTML("HideShowMenuButton", "<p>SHOW MAIN MENU</p>");
			};
		};

		this.OnLogin = function() {
			if (Master.State.Wishes.GetWhoWishesBelongTo().length > 0) {
				this.ShowHideWishlistFunctions("show");
			};
		};

		this.OnRenderWishlist = function() {
			var VerifyAuthenticationRet = Master.State.Authentication.VerifyAuthentication();
			if (VerifyAuthenticationRet.Data == true) {
				this.ShowHideWishlistFunctions("show");
			};
			var WishlistOwner = Master.State.Wishes.GetWhoWishesBelongTo();
			Master.Views.HeaderSection.DisplayWishlistOwner(WishlistOwner);
		};

		this.ShowHideWishlistFunctions = function(ShowOrHide) {
			Master.Views.HeaderSection.ShowOrHideElement("ToggleEditButton", ShowOrHide);
			Master.Views.HeaderSection.ShowOrHideElement("AddNewWishButton", ShowOrHide);
			Master.Views.HeaderSection.ShowOrHideElement("SaveToDiskButton", ShowOrHide);
		};

		this.OnLogout = function() {
			this.ShowHideWishlistFunctions("hide");
			this.OnDisableEdit();
		};

		this.OnEnableEdit = function(CallingHTMLElement) {
			var ToggleEditButtonAnchorName = "ToggleEditButton";
			var ToggleEditButton = Master.Views.HeaderSection.GetAnchorReference(ToggleEditButtonAnchorName);

			ToggleEditButton.removeEventListener("click", Master.Views.HeaderSection.EventHandlers.EnableEditing);
			ToggleEditButton.addEventListener("click", Master.Views.HeaderSection.EventHandlers.DisableEditing);

			Master.Views.HeaderSection.ChangeStyle(ToggleEditButtonAnchorName, "background-color", "white");
			Master.Views.HeaderSection.ChangeElementInnerHTML(ToggleEditButtonAnchorName, "<p>DISABLE EDITING</p>");

			Master.Controllers.Wishes.OnEnableEdit();
		};

		this.OnDisableEdit = function(CallingHTMLElement) {
			var ToggleEditButtonAnchorName = "ToggleEditButton";
			var ToggleEditButton = Master.Views.HeaderSection.GetAnchorReference(ToggleEditButtonAnchorName);

			ToggleEditButton.removeEventListener("click", Master.Views.HeaderSection.EventHandlers.DisableEditing);
			ToggleEditButton.addEventListener("click", Master.Views.HeaderSection.EventHandlers.EnableEditing);

			Master.Views.HeaderSection.ChangeStyle(ToggleEditButtonAnchorName, "background-color", "#FAD67B");
			Master.Views.HeaderSection.ChangeElementInnerHTML(ToggleEditButtonAnchorName, "<p>ENABLE EDITING</p>");

			Master.Controllers.Wishes.OnDisableEdit();
		};

		this.OnSaveToDisk = function() {

			var PostData = {};
			var BackendReturnData = {};
			var Wishlist = Master.State.Wishes.GetListOfWishes().Data;
			var WishlistOwner = Master.State.Wishes.GetWhoWishesBelongTo();

			PostData.WishOwner = WishlistOwner;
			PostData.Wishlist = Wishlist;

			var BackendRequest = new Master.Constructors.Models.BackendRequest();
			var BackendRequestReturn = BackendRequest.Load("SaveToDisk.cfm", PostData, "application/x-www-form-urlencoded");

			if (BackendRequestReturn.Status == "NOK") {
				console.log("OnSaveToDisk() calling SaveToDisk.cfm via BackendRequest() has failed apparently!");
				console.log(BackendRequest.Errors);
				window.alert("Oh noes! Something went wrong :(");
				return false;
			};

			if (BackendRequestReturn.Status == "OK") {

				BackendReturnData = JSON.parse(BackendRequestReturn.Data.Response);

				if (BackendReturnData.Status == "OK") {
					window.alert("Changes saved succesfully!");
				}
				else if (BackendReturnData.Status == "NOK") {
					window.alert("Oh noes! Something went wrong :(");
					console.log(BackendReturnData.Errors);
					return false;
				};
			};

			Master.Controllers.CenterSection.RenderWishlist();
			return true;
		};

		this.OnAddNewWish = function() {
			Master.Controllers.CenterSection.OnAddNewWish();
			window.alert("New wish added.\nNOTE: Empty wishes will be deleted when you save or reload the page/wishlist!");
		};
	},

	Init: function() {
		Master.Controllers.MainMenu = new Master.Constructors.Controllers.MainMenu();
		Master.Controllers.HelpSection = new Master.Constructors.Controllers.HelpSection();
		Master.Controllers.HeaderSection = new Master.Constructors.Controllers.HeaderSection();
		Master.Controllers.Wishes = new Master.Constructors.Controllers.Wishes();
		Master.Controllers.WishHeaders = new Master.Constructors.Controllers.WishHeaders();
		Master.Controllers.CenterSection = new Master.Constructors.Controllers.CenterSection();
	}
};