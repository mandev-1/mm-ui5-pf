sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("com.mmd.controller.ABAPDevelopment", {
		onInit: function () {
			// Load quiz data
			var oModel = new JSONModel();
			this.getView().setModel(oModel);
			
			// Show loading indicator
			var oBusyIndicator = this.byId("loadingIndicator");
			if (oBusyIndicator) {
				oBusyIndicator.setVisible(true);
			}
			
			// Try multiple path resolutions
			var sPath = sap.ui.require.toUrl("com/mmd/model/abapQuizData.json");
			var sAltPath = "./webapp/model/abapQuizData.json";
			var sAltPath2 = "model/abapQuizData.json";
			
			var that = this;
			var iAttempt = 0;
			var aPaths = [sPath, sAltPath, sAltPath2];
			
			// Add error handling
			oModel.attachRequestFailed(function(oEvent) {
				iAttempt++;
				console.error("Failed to load quiz data from path " + (iAttempt) + ":", aPaths[iAttempt - 1], oEvent);
				
				if (iAttempt < aPaths.length) {
					// Try next path
					console.log("Trying alternative path:", aPaths[iAttempt]);
					oModel.loadData(aPaths[iAttempt]);
				} else {
					MessageToast.show("Failed to load quiz data from all paths. Please check the console.");
					if (oBusyIndicator) {
						oBusyIndicator.setVisible(false);
					}
				}
			});
			
			// Initialize quiz state after model loads
			oModel.attachRequestCompleted(function() {
				var oData = oModel.getData();
				console.log("Quiz data loaded successfully:", oData ? (Array.isArray(oData) ? oData.length + " questions" : "Data structure: " + Object.keys(oData)) : "No data");
				that._initializeQuizState();
				// Hide loading indicator
				if (oBusyIndicator) {
					oBusyIndicator.setVisible(false);
				}
			});
			
			console.log("Loading quiz data from:", sPath);
			oModel.loadData(sPath);
		},
		
		_initializeQuizState: function () {
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			
			// Handle both array and object structures
			var aQuestions;
			if (Array.isArray(oData)) {
				aQuestions = oData;
			} else if (oData && oData.questions && Array.isArray(oData.questions)) {
				aQuestions = oData.questions;
			} else {
				console.error("Invalid quiz data structure:", oData);
				MessageToast.show("Invalid quiz data format");
				return;
			}
			
			if (!aQuestions || aQuestions.length === 0) {
				console.error("No questions found in data");
				MessageToast.show("No questions found in quiz data");
				return;
			}
			
			// Add state properties to each question and option
			aQuestions.forEach(function(oQuestion) {
				oQuestion.checked = false;
				oQuestion.feedback = "";
				oQuestion.feedbackClass = "";
				if (oQuestion.options && Array.isArray(oQuestion.options)) {
					oQuestion.options.forEach(function(oOption) {
						oOption.selected = false;
					});
				}
			});
			
			oModel.setData({ questions: aQuestions, checked: false });
			oModel.refresh();
			console.log("Quiz initialized with", aQuestions.length, "questions");
		},
		
		formatOption: function(sKey, sText) {
			return sKey + ". " + sText;
		},
		
		onOptionSelect: function (oEvent) {
			var oSelectedControl = oEvent.getSource();
			var bSelected = oSelectedControl.getSelected();
			var oBindingContext = oSelectedControl.getBindingContext();
			
			if (!oBindingContext) {
				return;
			}
			
			var sPath = oBindingContext.getPath();
			var oModel = this.getView().getModel();
			var oOption = oModel.getProperty(sPath);
			
			// Update selected state
			oOption.selected = bSelected;
			
			// If single select, unselect others
			var sQuestionPath = sPath.substring(0, sPath.lastIndexOf("/options"));
			var oQuestion = oModel.getProperty(sQuestionPath);
			
			if (oQuestion.select === 1 && bSelected) {
				// Unselect all other options
				oQuestion.options.forEach(function(oOpt) {
					if (oOpt !== oOption) {
						oOpt.selected = false;
					}
				});
			}
			
			oModel.refresh();
		},
		
		onCheckAnswers: function () {
			var oModel = this.getView().getModel();
			var aQuestions = oModel.getData().questions;
			var iTotal = aQuestions.length;
			var iCorrect = 0;
			var iIncorrect = 0;
			
			aQuestions.forEach(function(oQuestion) {
				oQuestion.checked = true;
				var aSelectedOptions = oQuestion.options.filter(function(oOpt) {
					return oOpt.selected === true;
				});
				var aCorrectOptions = oQuestion.options.filter(function(oOpt) {
					return oOpt.correct === true;
				});
				
				// Check if all correct options are selected and no incorrect ones
				var bAllCorrectSelected = aCorrectOptions.every(function(oCorrect) {
					return aSelectedOptions.some(function(oSelected) {
						return oSelected.key === oCorrect.key;
					});
				});
				var bNoIncorrectSelected = aSelectedOptions.every(function(oSelected) {
					return oSelected.correct === true;
				});
				var bIsCorrect = bAllCorrectSelected && 
				                 aSelectedOptions.length === aCorrectOptions.length &&
				                 bNoIncorrectSelected;
				
				if (bIsCorrect) {
					iCorrect++;
					oQuestion.feedback = "✓ Correct!";
					oQuestion.feedbackClass = "quizFeedbackCorrect";
				} else {
					iIncorrect++;
					var sMissed = aCorrectOptions.filter(function(oCorrect) {
						return !aSelectedOptions.some(function(oSelected) {
							return oSelected.key === oCorrect.key;
						});
					}).map(function(o) { return o.key; }).join(", ");
					
					var sWrong = aSelectedOptions.filter(function(oSelected) {
						return !oSelected.correct;
					}).map(function(o) { return o.key; }).join(", ");
					
					var sFeedback = "✗ Incorrect.";
					if (sMissed) {
						sFeedback += " Missed: " + sMissed + ".";
					}
					if (sWrong) {
						sFeedback += " Wrong: " + sWrong + ".";
					}
					oQuestion.feedback = sFeedback;
					oQuestion.feedbackClass = "quizFeedbackIncorrect";
				}
				
				// Mark options visually
				oQuestion.options.forEach(function(oOption) {
					if (oOption.correct && oOption.selected) {
						oOption.optionClass = "quizOptionCorrect";
					} else if (oOption.correct && !oOption.selected) {
						oOption.optionClass = "quizOptionMissed";
					} else if (!oOption.correct && oOption.selected) {
						oOption.optionClass = "quizOptionWrong";
					} else {
						oOption.optionClass = "";
					}
				});
			});
			
			oModel.setProperty("/checked", true);
			oModel.setProperty("/summary", {
				total: iTotal,
				correct: iCorrect,
				incorrect: iIncorrect,
				percentage: Math.round((iCorrect / iTotal) * 100)
			});
			
			var sSummaryText = "Results: " + iCorrect + " correct, " + iIncorrect + " incorrect out of " + iTotal + " questions (" + Math.round((iCorrect / iTotal) * 100) + "%)";
			this.byId("summaryText").setText(sSummaryText);
			this.byId("summaryPanel").setExpanded(true);
			
			oModel.refresh();
			MessageToast.show("Answers checked! " + iCorrect + " out of " + iTotal + " correct.");
		},
		
		onReset: function () {
			this._initializeQuizState();
			this.byId("summaryPanel").setExpanded(false);
			MessageToast.show("Quiz reset. Select your answers again.");
		},
		
		onRevealCorrect: function () {
			var oModel = this.getView().getModel();
			var aQuestions = oModel.getData().questions;
			
			aQuestions.forEach(function(oQuestion) {
				oQuestion.options.forEach(function(oOption) {
					oOption.selected = oOption.correct === true;
				});
			});
			
			oModel.refresh();
			MessageToast.show("Correct answers revealed. Click 'Check Answers' to verify or 'Reset' to try again.");
		},
		
		onHomePress: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RouteHome");
		},
		
		onOtherArticlesPress: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RouteHome");
		}
	});
});

