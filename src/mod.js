// DISCLAIMER

// a lot of this code is studied or taken from Alex's Operator and Questor mod, because theres no documentation on how to make a trader without it being a mod that you install in Aki's base files
// if anyone wants to make more noob friendly tutorials for modding that would be epic

"use strict";

class Mod {
	constructor() {
		this.mod = "thelmexx-CombatMedic";
		this.funcptr = HttpServer.onRespond["IMAGE"];
		
		Logger.info(`Loading: ${this.mod}`);
		ModLoader.onLoad[this.mod] = this.load.bind(this);
		HttpServer.onRespond["IMAGE"] = this.getImage.bind(this);
	}
	
	
	load() {
		const config = require("../config.json");
		const filepath = `${ModLoader.getModPath(this.mod)}db/`;
		const locales = DatabaseServer.tables.locales.global;
		
		for (const locale in locales) {
			locales[locale].trading.CLS = {
				FullName: "Laika Bozhko",
				FirstName: "Laika",
				Nickname: "Combat Medic",
				Location: "Streets of Tarkov",
				Description:
					"Former BEAR PMC medic, also known as Combat Life Saver, abbreviated to CLS. Went AWOL after her squad was ambushed by Cultists during a night raid. Now works odd ends for Therapist, supplying medical equipment, but holds her own in CQC.",
			};
		}

		const assort = this.assort();

		DatabaseServer.tables.traders.CLS = {
			base: JsonUtil.deserialize(VFS.readFile(`${filepath}base.json`)),
			assort: assort,
		};
	}
	
	
	getImage(sessionID, req, resp, body) {
		const filepath = `${ModLoader.getModPath(this.mod)}avatar/`;

		if (req.url.includes("/avatar")) {
			HttpServer.sendFile(resp, `${filepath}test.jpg`);
			return;
		}

		this.funcptr(sessionID, req, resp, body);
	}

	assort() {
		const assort = {
			items: [],
			barter_scheme: {},
			loyal_level_items: {},
		};
		
		function cashTrade(name, id, stock, price, loyalty) {
			assort.items.push({
				_id: name,
				_tpl: id,
				upd: {
					UnlimitedCount: false,
					StackObjectsCount: stock,
				},
				parentId: "hideout",
				slotId: "hideout",
			});
			assort.barter_scheme[name] = [
				[
					{
						count: price,
						_tpl: "5449016a4bdc2d6f028b456f", // TODO: make a table with roubles, dollars, euros
					},
				],
			];
			assort.loyal_level_items[name] = loyalty;
		}
		// 	NAME ID STOCK PRICE LOYALTY
		cashTrade("cheese_cash", "5755356824597772cb798962", 20, 4000, 1);
		cashTrade("car_cash", "544fb45d4bdc2dee738b4568", 4, 7000, 1);
		cashTrade("aseptic_cash", "544fb45d4bdc2dee738b4568", 8, 1400, 1);
		cashTrade("esmarch_cash", "5e831507ea0a7c419c2f9bd9", 6, 2000, 1)
		
	return assort;
	}
}	

module.exports.Mod = Mod;


























