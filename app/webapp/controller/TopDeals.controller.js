sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/GenericTile",
	"sap/m/TileContent",
	"sap/ui/layout/GridData",
	"sap/m/MessageToast",
	"sap/m/BusyDialog"
], function (Controller, GenericTile, TileContent, GridData, MessageToast, BusyDialog) {
	"use strict";

	return Controller.extend("com.mmd.controller.TopDeals", {
		onInit: function () {
			this._oBusy = new BusyDialog();
			this._loadDeals();
		},

		_loadDeals: function () {
			this._oBusy.open();
			var that = this;
			fetch("/api/deals")
				.then(function (res) {
					if (!res.ok) throw new Error(res.statusText);
					return res.json();
				})
				.then(function (data) {
					that._oBusy.close();
					that._buildTiles("tilesLombok", data.lombok || []);
					that._buildTiles("tilesSurfing", data.surfing || []);
				})
				.catch(function (err) {
					that._oBusy.close();
					MessageToast.show("Could not load deals. Using sample data.");
					that._useFallbackDeals();
				});
		},

		_useFallbackDeals: function () {
			var fallback = {
				lombok: [
					{ id: "l1", destination: "Lombok (LOP)", tagline: "Direct flights · Kuta & Senggigi", price: "€489", date: "Mar – May 2025", backgroundImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600", url: "https://www.skyscanner.com/transport/flights/lop/" },
					{ id: "l2", destination: "Bali → Lombok", tagline: "Island hop · Surf & culture", price: "€329", date: "Apr – Jun 2025", backgroundImage: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600", url: "https://www.skyscanner.com/transport/flights/bali/lombok/" }
				],
				surfing: [
					{ id: "s1", destination: "Bali (DPS)", tagline: "Uluwatu · Canggu · Bingin", price: "€549", date: "Mar – Sep 2025", backgroundImage: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600", url: "https://www.skyscanner.com/transport/flights/dps/" }
				]
			};
			this._buildTiles("tilesLombok", fallback.lombok);
			this._buildTiles("tilesSurfing", fallback.surfing);
		},

		_buildTiles: function (sGridId, aDeals) {
			var oGrid = this.byId(sGridId);
			if (!oGrid) { return; }
			oGrid.destroyContent();
			(aDeals || []).forEach(function (oDeal) {
				var oTile = new GenericTile({
					header: oDeal.destination,
					subheader: oDeal.tagline,
					frameType: "TwoByHalf",
					backgroundImage: oDeal.backgroundImage,
					class: "sapUiTinyMargin topDealsTile",
					press: this.onDealPress.bind(this)
				});
				oTile.setLayoutData(new GridData({ span: "L3 M4 S6" }));
				oTile.addAggregation("tileContent", new TileContent({
					unit: oDeal.price || "—",
					footer: oDeal.date || "—"
				}));
				oTile.data("deal", oDeal);
				oGrid.addContent(oTile);
			}.bind(this));
		},

		onDealPress: function (oEvent) {
			var oDeal = oEvent.getSource().data("deal");
			if (oDeal && oDeal.url) {
				window.open(oDeal.url, "_blank");
			} else {
				MessageToast.show("No link available");
			}
		}
	});
});
