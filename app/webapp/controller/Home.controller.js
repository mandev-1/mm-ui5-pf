sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment"
], function (Controller, JSONModel, MessageToast, Fragment) {
	"use strict";

	return Controller.extend("com.mmd.controller.Home", {
		onInit: function () {
			// Load card manifests model
			var oManifestsModel = new JSONModel();
			oManifestsModel.loadData(sap.ui.require.toUrl("com/mmd/model/cardManifests.json"));
			this.getView().setModel(oManifestsModel, "manifests");
			
			// Setup sparkle animation after view is rendered
			this.getView().addDelegate({
				onAfterRendering: this._setupSparkleAnimation.bind(this)
			});
			
			// Setup profile picture after view is rendered
			this.getView().addDelegate({
				onAfterRendering: this._setupProfilePicture.bind(this)
			});
			
			// Force center content after render
			this.getView().addDelegate({
				onAfterRendering: this._forceCenterContent.bind(this)
			});
		},
		
		_forceCenterContent: function() {
			// Force centering using the same pattern as other site
			var oPage = this.byId("homePage");
			if (oPage) {
				var oPageDom = oPage.getDomRef();
				if (oPageDom) {
					// Outer container - flexbox centering
					var oContentArea = oPageDom.querySelector(".sapMPageContent");
					if (oContentArea) {
						oContentArea.style.display = "flex";
						oContentArea.style.justifyContent = "center";
						oContentArea.style.width = "100%";
					}
					
					// Inner container - max-width with auto margins
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
		
		_setupProfilePicture: function() {
			var oProfileImg = document.getElementById("profilePictureImg") || document.querySelector(".profilePicture");
			if (oProfileImg) {
				// Get the base path similar to how CSS handles bg3.png
				var sBasePath = window.location.pathname;
				sBasePath = sBasePath.substring(0, sBasePath.lastIndexOf('/'));
				if (sBasePath.endsWith('/app')) {
					sBasePath = sBasePath + '/webapp/headshot_evoto.png';
				} else if (sBasePath.endsWith('/webapp')) {
					sBasePath = sBasePath + '/headshot_evoto.png';
				} else {
					sBasePath = sBasePath + '/webapp/headshot_evoto.png';
				}
				
				// Set the image source
				oProfileImg.src = sBasePath;
				
				// Fallback: try relative path
				oProfileImg.onerror = function() {
					oProfileImg.src = './webapp/headshot_evoto.png';
					oProfileImg.onerror = function() {
						oProfileImg.src = 'headshot_evoto.png';
					};
				};
			}
		},
		
		_setupSparkleAnimation: function() {
			var oHeading = document.getElementById("sparkleHeading");
			if (!oHeading) {
				return;
			}
			
			var aSparkles = ["✨", "⭐", "💫", "✨", "⭐"];
			
			oHeading.addEventListener("mouseenter", function() {
				// Find the "built" word element
				var oBuiltWord = oHeading.querySelector(".builtWord");
				if (!oBuiltWord) {
					return;
				}
				
				// Get position of the "built" word, not the entire heading
				var oRect = oBuiltWord.getBoundingClientRect();
				var iCenterX = oRect.left + oRect.width / 2;
				var iCenterY = oRect.top + oRect.height / 2;
				
				// Create multiple sparkles from the "built" word
				for (var i = 0; i < 5; i++) {
					setTimeout(function(iIndex) {
						var oSparkle = document.createElement("span");
						oSparkle.textContent = aSparkles[iIndex % aSparkles.length];
						oSparkle.style.position = "fixed";
						oSparkle.style.left = iCenterX + "px";
						oSparkle.style.top = iCenterY + "px";
						oSparkle.style.fontSize = (Math.random() * 10 + 10) + "px";
						oSparkle.style.pointerEvents = "none";
						oSparkle.style.zIndex = "9999";
						oSparkle.style.opacity = "1";
						
						var iAngle = (Math.PI * 2 * iIndex) / 5;
						var iDistance = 80 + Math.random() * 40;
						var iEndX = iCenterX + Math.cos(iAngle) * iDistance;
						var iEndY = iCenterY + Math.sin(iAngle) * iDistance;
						
						document.body.appendChild(oSparkle);
						
						oSparkle.animate([
							{
								transform: "translate(0, 0) rotate(0deg) scale(1)",
								opacity: 1
							},
							{
								transform: "translate(" + (iEndX - iCenterX) + "px, " + (iEndY - iCenterY) + "px) rotate(" + (iAngle * 180 / Math.PI + 360) + "deg) scale(0)",
								opacity: 0
							}
						], {
							duration: 1000 + Math.random() * 500,
							easing: "ease-out"
						}).onfinish = function() {
							if (document.body.contains(oSparkle)) {
								document.body.removeChild(oSparkle);
							}
						};
					}.bind(this, i), i * 50);
				}
			}.bind(this));
		},
		
		onViewProjects: function () {
			// Navigate to projects page
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RouteProjects");
		},
		
		onConnectProfessionally: function () {
			// Open LinkedIn or contact dialog
			MessageToast.show("Opening professional connection...");
			// You can add actual LinkedIn link or contact dialog here
			window.open("https://www.linkedin.com", "_blank");
		},
		
		onRevealGrid: function (oEvent) {
			var bPressed = oEvent.getParameter("pressed");
			var aGrids = ["grid1", "grid2", "grid3", "grid4"];
			aGrids.forEach(function(sGridId) {
				var oGrid = this.byId(sGridId);
				if (oGrid) {
					oGrid.setRevealGrid(bPressed);
				}
			}.bind(this));
		},
		
		onBorderReached: function (oEvent) {
			MessageToast.show("Grid border reached: " + oEvent.getParameter("name"));
		},
		
		goToABAPDevelopment: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RouteABAPDevelopment");
		},
		
		pressOnTileTwo: function () {
			this._openMeetingDialog();
		},
		
		_openMeetingDialog: function () {
			var that = this;
			
			// Check if dialog already exists
			if (!this._oMeetingDialog) {
				// Load the dialog fragment
				Fragment.load({
					id: this.getView().getId(),
					name: "com.mmd.view.fragments.MeetingDialog",
					controller: this
				}).then(function (oDialog) {
					that._oMeetingDialog = oDialog;
					that.getView().addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this._oMeetingDialog.open();
			}
		},
		
		onMeetingDialogClose: function () {
			if (this._oMeetingDialog) {
				this._oMeetingDialog.close();
			}
		},
		
		onSendEmailPress: function () {
			// Open email client with mailto link
			window.location.href = "mailto:mmanbusiness1@gmail.com?subject=Meeting Request";
			if (this._oMeetingDialog) {
				this._oMeetingDialog.close();
			}
		}
	});
});
