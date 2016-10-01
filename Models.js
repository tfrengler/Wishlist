Master.Constructors.Models = {

	Authentication: function() {

		this.AuthenticationKey = "";

		this.SetAuthenticationKey = function(Data) {
			var ReturnData = {
				Status: "NOK",
				Errors: []
			};

			if (typeof Data == "string") {
				this.AuthenticationKey = Data;
				ReturnData.Status = "OK";
			}
			else {
				ReturnData.Errors.push("Parameter 'Data' is not a String!");
			};

			return ReturnData;
		};

		this.GetAuthenticationKey = function() {
			var ReturnData = {
				Errors: [],
				Data: this.AuthenticationKey,
				Status: "OK"
			};
			return ReturnData;
		};

		this.VerifyAuthentication = function() {
			var ReturnData = {
				Data: "",
				Status: "NOK",
				Errors: []
			};
			var RequestData = {
				Action: "Verify",
				Parameter: this.GetAuthenticationKey().Data
			};

			var Request = new Master.Constructors.Models.BackendRequest();
			var BackendReturn = Request.Load("Authenticate.php", RequestData, "application/x-www-form-urlencoded");

			if (BackendReturn.Status == "OK") {
				ReturnData.Data = BackendReturn.Data;
			}
			else if (BackendReturn.Status == "NOK") {
				ReturnData.Errors.push(BackendReturn.Errors);
				return ReturnData;
			};


			var BackendReturnData = JSON.parse(BackendReturn.Data.Response);
			if (BackendReturnData.Status == "OK") {
				ReturnData.Status = "OK";
				ReturnData.Data = true;
			}
			else if (BackendReturnData.Status == "NOK") {
				ReturnData.Status = "OK";
				ReturnData.Data = false;
			};

			return ReturnData;
		};
		
		this.Login = function(LoginCode) {
			var ReturnData = {
				Status: "NOK",
				Errors: [],
				Data: ""
			};

			var HashedLoginCode = Master.Lib.HashString(LoginCode);
			var PostData = {
				Action: "Login",
				Parameter: HashedLoginCode
			};
			var SetAuthenticationKeyReturn = "";
			var BackendReturnData = {};
			var AuthKey = "";
			
			var Request = new Master.Constructors.Models.BackendRequest();
			var BackendReturn = Request.Load("Authenticate.php", PostData, "application/x-www-form-urlencoded");

			if (BackendReturn.Status == "OK") {
				BackendReturnData = JSON.parse(BackendReturn.Data.Response);
				
				if (BackendReturnData.Status == "OK") {
					AuthKey = BackendReturnData.Message;
					SetAuthenticationKeyReturn = this.SetAuthenticationKey(AuthKey);

					if (SetAuthenticationKeyReturn.Status = "OK") {
						ReturnData.Status = "OK";
					}
					else {
						ReturnData.Errors.push(SetAuthenticationKeyReturn.Errors);
					}
				}
				else if (BackendReturnData.Status == "NOK")  {
					ReturnData.Status = "OK";
					ReturnData.Data = BackendReturnData.Message;
				};	
			}
			else if (BackendReturn.Status == "NOK") {
				ReturnData.Errors.push(BackendReturn.Errors);
			};

			return ReturnData;
		};

		this.Logout = function() {
			this.SetAuthenticationKey("");
		};
	},

	Wish: function(Picture, Description, Links, SortOrder, ID) {

		this.Picture = Picture;
		this.Description = Description;
		this.Links = Links;
		this.SortOrder = SortOrder;
		this.ID = ID;

		this.GetPicture = function() {
			return this.Picture;
		};
		this.SetPicture = function(Data) {
			this.Picture = Data;
		};

		this.GetDescription = function() {
			return this.Description;
		};
		this.SetDescription = function(Data) {
			this.Description = Data;
		};

		this.GetLinks = function() {
			return this.Links;
		};
		this.SetLinks = function(Data) {
			this.Links = Data;
		};

		this.GetSortOrder = function() {
			return this.SortOrder;
		};
		this.SetSortOrder = function(Data) {
			this.SortOrder = Data;
		};

		this.GetID = function() {
			return this.ID;
		};
		this.SetID = function(Data) {
			this.ID = Data;
		};

		this.IsEmpty = function() {
			var ReturnData = true;

			var Picture = this.GetPicture();
			var Description = this.GetDescription();
			var Links = this.GetLinks();

			if (Picture.length > 0) {
				ReturnData = false;
				return ReturnData;
			};
			if (Description.length > 0) {
				ReturnData = false;
				return ReturnData;
			};
			if (Links.length > 0) {
				ReturnData = false;
				return ReturnData;
			};

			return ReturnData;
		};
	},

	Wishlist: function() {

		this.ListOfWishes = {};
		this.WishesBelongTo = "";

		this.GetListOfWishes = function() {
			var ReturnData = {
				Data: "",
				Status: "NOK",
				Errors: []
			};

			if (this.ListOfWishes instanceof Object) {
				ReturnData.Status = "OK";
				ReturnData.Data = this.ListOfWishes;
			}
			else {
				ReturnData.Errors.push("this.ListOfWishes is not an Object!");
			}

			return ReturnData;
		};
		this.SetListOfWishes = function(Data) {
			var ReturnData = {
				Status: "NOK",
				Errors: []
			};

			if (Data instanceof Object) {
				this.ListOfWishes = Data;
				ReturnData.Status = "OK";
			}
			else {
				ReturnData.Errors.push("Parameter 'Data' is not an Object!");
			};
			
			return ReturnData;
		};
		this.GetWishByID = function(WishID) {
			var ReturnData = {
				Data: {},
				Errors: [],
				Status: "NOK"
			};
			var Status = "";

			if (typeof WishID == "string") {
				if (WishID.length > 0) {
					Status = "OK";
				}
				else {
					ReturnData.Errors.push("Parameter 'WishID' is a string but is empty!");
				};
			}
			else {
				ReturnData.Errors.push("Parameter 'WishID' is not a string!");
			};		

			if (Status == "OK") {
				if (typeof this.ListOfWishes[WishID] == "undefined") {
					ReturnData.Errors.push("This wish is not defined!");
				}
				else {
					ReturnData.Data = this.ListOfWishes[WishID];
					ReturnData.Status = "OK";
				};
			};

			return ReturnData;
		};

		this.RemoveEmptyWishes = function() {
			var GetListOfWishesRet = this.GetListOfWishes();
			var Wishes = GetListOfWishesRet.Data;
			var CurrentWish = "";

			for (CurrentWish in Wishes) {
				if (Wishes[CurrentWish].IsEmpty() == true) {
					this.DeleteWish(CurrentWish);
				};
			};
		};

		this.InsertNewWish = function(Data) {
			var ReturnData = {
				Errors: [],
				Status: "NOK"
			};
			var Status = "";
			var NewWishNumber = 0;

			if (Data instanceof Object) {
				Status = "OK";
			}
			else {
				ReturnData.Errors.push("Parameter 'Data' is not an Object!");
			};

			if (Status == "OK") {
				var GenerateNewWishIDReturn = this.GenerateNewWishID();

				if (GenerateNewWishIDReturn.Status == "NOK") {
					Status = "NOK";
					ReturnData.Errors.push(GenerateNewWishIDReturn.Errors);
				}
				else if (GenerateNewWishIDReturn.Status == "OK") {
					NewWishNumber = GenerateNewWishIDReturn.Data;
					Data.ID = NewWishNumber;
				};
			};

			if (Status == "OK") {
				if (typeof this.ListOfWishes["Wish_" + NewWishNumber] == "undefined") {
					this.ListOfWishes["Wish_" + NewWishNumber] = Data;
					ReturnData.Status = "OK";
				}
				else {
					ReturnData.Errors.push("Wish with number " + NewWishNumber +  " already exists!");
				};
			};

			return ReturnData;
		};

		this.DeleteWish = function(WishID) {
			var ReturnData = {
				Status: "NOK",
				Errors: []
			};
			var Status = "";

			if (typeof WishID == "string") {
				if (WishID.length > 0) {
					Status = "OK";
				}
				else {
					ReturnData.Errors.push("Parameter 'WishID' is a string but is empty!");
				};
			}
			else {
				ReturnData.Errors.push("Parameter 'WishID' is not a string!");
			};

			if (Status == "OK") {
				if (typeof this.ListOfWishes[WishID] == "undefined") {
					ReturnData.Errors.push("Can't delete wish with ID '" + WishID + "' as it doesn't exist!");
				}
				else {
					delete this.ListOfWishes[WishID];
					ReturnData.Status = "OK";
				};
			};

			return ReturnData;
		};

		this.GetAmountOfWishes = function() {
			var ReturnData = {
				Errors: [],
				Status: "NOK",
				Data: 0
			};
			var Status = "";

			var GetListOfWishesRet = this.GetListOfWishes();
			var AmountOfWishes = 0;

			if (GetListOfWishesRet instanceof Object) {
				Status = "OK";
			}
			else {
				ReturnData.Errors.push("GetAmountOfWishes()->this.GetListOfWishes() did not return an object!");
			};

			if (Status == "OK") {
				AmountOfWishes = Object.keys(GetListOfWishesRet.Data).length;
				ReturnData.Data = AmountOfWishes;
				ReturnData.Status = "OK";
			};

			return ReturnData;
		};

		this.GenerateNewWishID = function() {
			var ReturnData = {
				Errors: [],
				Status: "NOK"
			};
			var Status = "";

			var Wish = "";
			var WishNumber = 0;
			var HighestWishNumber = 0;
			var ListOfWishes = this.GetListOfWishes().Data;
			var ListOfWishNumbers = [];

			if (ListOfWishes instanceof Object) {
				Status = "OK";
			}
			else {
				ReturnData.Errors.push("GenerateNewWishID()->this.GetListOfWishes() did not return an object!");
			};

			if (Status == "OK") {
				if (Object.keys(ListOfWishes).length > 0) {
					for (Wish in ListOfWishes) {
						WishNumber = Wish.substring(Wish.lastIndexOf("_") + 1);
						ListOfWishNumbers.push(WishNumber);
					};
				}

				if (ListOfWishNumbers.length > 0) {
					HighestWishNumber = Math.max.apply(this, ListOfWishNumbers);
				};

				ReturnData.Data = HighestWishNumber + 1;
				ReturnData.Status = "OK";
			};
			
			return ReturnData;
		};

		this.SetWhoWishesBelongTo = function(Data) {
			var ReturnData = {
				Status: "NOK",
				Errors: []
			};
			var Status = "";

			if (typeof Data == "string") {
				Status = "OK";
			}
			else {
				ReturnData.Errors.push("Parameter 'Data' is not a string!");
			};

			if (Status == "OK") {
				this.WishesBelongTo = Data;
				ReturnData.Status = "OK";	
			};

			return ReturnData;
		};

		this.GetWhoWishesBelongTo = function() {
			return this.WishesBelongTo;
		};

		this.PurgeWishlistData = function() {
			var ReturnData = {
				Status: "NOK",
				Errors: []
			};
			var Status = "";

			var SetListOfWishesReturn = this.SetListOfWishes({});
			var SetWhoWishesBelongToReturn = this.SetWhoWishesBelongTo("");
			
			if (SetListOfWishesReturn.Status == "OK") {
				Status = "OK";
			}
			else if (SetListOfWishesReturn.Status == "NOK") {
				Status = "NOK";
				ReturnData.Errors.push(SetListOfWishesReturn.Errors);
			};
			if (SetWhoWishesBelongToReturn.Status == "OK") {
				Status = "OK";
			}
			else if (SetWhoWishesBelongToReturn.Status == "NOK") {
				Status = "NOK";
				ReturnData.Errors.push(SetWhoWishesBelongToReturn.Errors);
			};

			if (Status == "OK") {
				ReturnData.Status = "OK";
			};
			
			return ReturnData;
		};

		this.BuildWish = function(XMLData) {

			var ReturnData = {
				Data: "",
				Status: "NOK",
				Errors: []
			};
			var CatchError = "";
			var i = 0;

			var Picture = "";
			var Description = "";
			var Links = [];
			var SortOrder = this.GetAmountOfWishes().Data;

			if (arguments[0]) {

				try {
					var PictureNode = XMLData.getElementsByTagName("Picture");
					var DescriptionNode = XMLData.getElementsByTagName("Description");
					var SortOrderNode = XMLData.getElementsByTagName("SortOrder");
					var LinksNode = XMLData.getElementsByTagName("Links");

					if (typeof PictureNode != "undefined") {
						Picture = PictureNode[0].childNodes[0].nodeValue;
					};

					if (typeof DescriptionNode != "undefined") {
						Description = DescriptionNode[0].childNodes[0].nodeValue;
					};

					if (typeof SortOrderNode != "undefined") {
						SortOrder = parseInt(SortOrderNode[0].childNodes[0].nodeValue);
					};
				
					if (typeof LinksNode[0] != "undefined") {
						for (i = 0; i < LinksNode[0].children.length; i++) {
							Links.push(LinksNode[0].children[i].childNodes[0].nodeValue);
						};
					};
				}
				catch(CatchError) {
					ReturnData.Errors.push(CatchError);
					return ReturnData;
				};
			};

			ReturnData.Data = new Master.Constructors.Models.Wish(Picture, Description, Links, SortOrder);
			ReturnData.Status = "OK";

			return ReturnData;
		};

		this.BuildWishlist = function(XMLData) {

			var ReturnData = {
				Data: {},
				Errors: [],
				Status: ""
			};
			
			var i = 0;
			var ListOfWishNodes = XMLData.getElementsByTagName("Wish");
			var ListOfFinishedWishes = [];
			var ListOfFormattedWishes = {};
			var BuildWishReturn = "";
			var StatusBuildWishes = "OK"
			var WishNumber = 1;
			var WishID = "";
			
			for (i = 0; i < ListOfWishNodes.length; i++) {
				BuildWishReturn = this.BuildWish(ListOfWishNodes[i]);

				if (BuildWishReturn.Status == "OK") {
					ListOfFinishedWishes.push(BuildWishReturn.Data);

				} else if (BuildWishReturn.Status == "NOK") {
					StatusBuildWishes = "NOK";
					break;
				};

				BuildWishReturn = "";
			};

			if (StatusBuildWishes == "NOK") {
				ReturnData.Status = "NOK";
				ReturnData.Errors = BuildWishReturn.Errors;
			}
			else if (StatusBuildWishes == "OK") {
				for (i = 0; i < ListOfFinishedWishes.length; i++) {
					WishID = "Wish_" + WishNumber;
					ListOfFormattedWishes[WishID] = ListOfFinishedWishes[i];
					ListOfFormattedWishes[WishID].ID = WishNumber;
					WishNumber++;
				};

				ReturnData.Data = ListOfFormattedWishes;
				ReturnData.Status = "OK";
			};

			return ReturnData;
		};

		this.SaveWishes = function(Wishlist) {

		};

		this.Load = function(WishlistOwner) {
			var ReturnData = {
				Status: "NOK",
				Errors: []
			};

			var FileToLoad = "wishlist_" + WishlistOwner + ".xml";

			var PurgeWishlistDataReturn = this.PurgeWishlistData();
			var SetListOfWishesReturn = "";
			var SetWhoWishesBelongToReturn = "";

			if (PurgeWishlistDataReturn.Status == "NOK")  {
				ReturnData.Errors.push(PurgeWishlistDataReturn.Errors);
				return ReturnData;
			};

			var Request = new Master.Constructors.Models.BackendRequest();

			var BuildWishlistReturn = {};
			var RequestResult = Request.Load(FileToLoad, false, false, true);

			if (RequestResult.Status == "NOK") {
				ReturnData.Errors.push(RequestResult.Errors);
				return ReturnData;
			} 
			else if (RequestResult.Status == "OK") {
				BuildWishlistReturn = this.BuildWishlist(RequestResult.Data.ResponseXML);

				if (BuildWishlistReturn.Status == "OK") {
					SetListOfWishesReturn = this.SetListOfWishes(BuildWishlistReturn.Data);
					SetWhoWishesBelongToReturn = this.SetWhoWishesBelongTo(WishlistOwner);
				}
				else if (BuildWishlistReturn.Status == "NOK")  {
					ReturnData.Errors.push(BuildWishlistReturn.Errors);
					return ReturnData;
				};
			};

			if (SetListOfWishesReturn.Status == "NOK") {
				ReturnData.Errors.push(SetListOfWishesReturn.Errors);
				return ReturnData;
			};
			if (SetWhoWishesBelongToReturn.Status == "NOK") {
				ReturnData.Errors.push(SetListOfWishesReturn.Errors);
				return ReturnData;
			};

			ReturnData.Status = "OK";
			return ReturnData;
		};
	},

	Settings: function() {

		this.Theme = "Standard";
		this.Language = "English";
		this.Debug = "on";

		this.GetTheme = function() {
			return this.GetTheme;
		};
		this.SetTheme = function(Data) {
			this.Theme = Data;
		};

		this.GetLanguage = function() {
			return this.Language;
		};
		this.SetLanguage = function(Data) {
			this.Language = Data;
		};

		this.GetDebug = function() {
			return this.Debug;
		};
		this.SetDebug = function(Data) {
			this.Debug = Data;
		};
	},

	BackendRequest: function() {
		// You can pass false to Data and ContentType if not needed in order to get to use UseGET for grabbing static content
		this.Load = function(File, Data, ContentType, UseGET) {
			var ReturnData = {
				Data: "",
				Status: "NOK",
				Errors: []
			};
			var BackendRequestReturn = "";

			BackendRequestReturn = this.HTTPRequest(File, Data, ContentType, UseGET);
			
			if (BackendRequestReturn.Status == "OK") {
				ReturnData.Status = "OK";
				ReturnData.Data = BackendRequestReturn.Data;
			}
			else if (BackendRequestReturn.Status == "NOK") {
				ReturnData.Status = "NOK";
				ReturnData.Errors = BackendRequestReturn.Errors;
			};

			return ReturnData;
		};
		
		this.HTTPRequest = function(RequestFile, Data, ContentType, UseGET) {

			var ReturnData = {
				Data: {
					Response: "",
					ResponseText: "",
					ResponseXML: ""
				},
				Status: "NOK",
				Errors: []
			};

			var Uncache = Date.now();
			var HTTPRequest = new XMLHttpRequest();
			var PostData = "";
			var HTTPRequestError = "";
			var HTTPMethod = "POST";

			if (UseGET) {
				HTTPMethod = "GET";
			};

			if (Data) {
				PostData = JSON.stringify(Data);
				PostData = encodeURIComponent(PostData);
			};

			if (HTTPMethod == "GET" && PostData.length < 0) {
				RequestFile += "?PostData=" + PostData + "&Uncache=" + Uncache;
			};

			HTTPRequest.open(HTTPMethod, RequestFile, false);

			if (ContentType && typeof ContentType == "string") {
				HTTPRequest.setRequestHeader("Content-type", ContentType);
			};

			try {
				if (HTTPMethod == "POST") {
					HTTPRequest.send("RequestData="+PostData+"&Uncache="+Uncache);	
				}
				else {
					HTTPRequest.send();
				};

				if (HTTPRequest.status == 200) {

					ReturnData.Data.Response = HTTPRequest.response;
					ReturnData.Data.ResponseText = HTTPRequest.responseText;
					ReturnData.Data.ResponseXML = HTTPRequest.responseXML;
					ReturnData.Status = "OK";
				}
				else if (HTTPRequest.status != 200) {

					ReturnData.Status = "NOK";
					ReturnData.Errors.push(HTTPRequest.statusText);
					ReturnData.Errors.push(HTTPRequest.responseText);
					ReturnData.Errors.push(HTTPRequest.response);
				};
			}
			catch(HTTPRequestError) {
				ReturnData.Status = "NOK";
				ReturnData.Errors.push(HTTPRequestError);
			};

			return ReturnData;
		};
	},

	ErrorHandler: function() {
		
		this.Run = function(Errors, Method, Arguments) {
			var DebugState = Master.State.Settings.GetDebug();

			window.alert("An internal error has happened - contact the admin, please");

			if (DebugState == "on") {
				if (arguments[0]) {
					console.log("ERRORS:");
					console.log(Errors);
				};
				if (arguments[1]) {
					console.log("METHOD/FUNCTION:");
					console.log(Method);
				};
				if (arguments[2]) {
					console.log("ARGUMENTS:");
					console.log(Arguments);
				};
			};

		};
	},

	Init: function() {
		Master.State.Settings = new Master.Constructors.Models.Settings();
		Master.State.Authentication = new Master.Constructors.Models.Authentication();
		Master.State.Wishes = new Master.Constructors.Models.Wishlist();
	}
};