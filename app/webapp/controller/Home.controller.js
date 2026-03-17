sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("com.mmd.controller.Home", {
		onInit: function () {
			this.getView().addDelegate({
				onAfterRendering: this._setupProfilePicture.bind(this)
			});
			this.getView().addDelegate({
				onAfterRendering: this._forceCenterContent.bind(this)
			});
		},

		_forceCenterContent: function () {
			var oPage = this.byId("homePage");
			if (oPage) {
				var oPageDom = oPage.getDomRef();
				if (oPageDom) {
					var oContentArea = oPageDom.querySelector(".sapMPageContent");
					if (oContentArea) {
						oContentArea.style.display = "flex";
						oContentArea.style.justifyContent = "center";
						oContentArea.style.width = "100%";
					}
					var oWrapper = oPageDom.querySelector(".homeContentWrapper");
					if (oWrapper) {
						oWrapper.style.maxWidth = "1080px";
						oWrapper.style.width = "95%";
						oWrapper.style.margin = "0 auto";
						oWrapper.style.boxSizing = "border-box";
					}
				}
			}
		},

		_setupProfilePicture: function () {
			var oProfileImg = document.getElementById("profilePictureImg") || document.querySelector(".profilePicture");
			if (oProfileImg) {
				var sBasePath = window.location.pathname;
				sBasePath = sBasePath.substring(0, sBasePath.lastIndexOf("/"));
				if (sBasePath.endsWith("/app")) {
					sBasePath = sBasePath + "/webapp/headshot_evoto.png";
				} else if (sBasePath.endsWith("/webapp")) {
					sBasePath = sBasePath + "/headshot_evoto.png";
				} else {
					sBasePath = sBasePath + "/webapp/headshot_evoto.png";
				}
				oProfileImg.src = sBasePath;
				oProfileImg.onerror = function () {
					oProfileImg.src = "./webapp/headshot_evoto.png";
					oProfileImg.onerror = function () {
						oProfileImg.src = "headshot_evoto.png";
					};
				};
			}
		},

		onViewProjects: function () {
			this.getOwnerComponent().getRouter().navTo("RouteProjects");
		},

		onConnectProfessionally: function () {
			MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("nav.linkedin"));
			window.open("https://www.linkedin.com/in/martin1man", "_blank");
		},

		pressOnTileTwo: function () {
			MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("home.tile.meeting"));
		},

		goToABAPDevelopment: function () {
			this.getOwnerComponent().getRouter().navTo("RouteABAPDevelopment");
		},

		onNavigateToDemo: function () {
			this.getOwnerComponent().getRouter().navTo("RouteDemo");
		},

		onNavigateTo42Prague: function () {
			this.getOwnerComponent().getRouter().navTo("RouteStudying42");
		}
	});
});
