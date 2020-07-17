planetNames = [ //7 galaxies, 4-8 inhabited systems per galaxy, 2-5 planets per system
	"Xesithea","Kustrapra","Ochiri","Vetriuq","Sealiv","Ubos","Cunanov","Crihitera","Grarvis 4RY0","Drorth YCK4",
	"Bosuanerth","Picoapra","Vocciuq","Haturn","Nuetov","Doliphus","Thoyatune","Zosie AIW","Nurn 23",
	"Padoutune","Tamoter","Nolmippe","Cuzosie","Sanides","Peacarro","Creavis","Vuhuphus","Grars LO19","Trolla M48",
	"Achouria","Bolluazuno","Gulryke","Pistryria","Ohos","Heugawa","Llethimia","Dasuphus","Sao N02","Geshan WHU",
	"Bilninia","Kanistea","Tonrapus","Hatrippe","Gonus","Mibos","Seenides","Pheatune","Made 6CZX","Troria V5S8",
	"Higeuzuno","Envoastea","Hochilles","Chongion","Zabos","Aetera","Lieria","Thinazuno","Theron S5J ","Gade OS2 ",
	"Ozaomia ","Pelvoturn ","Tinvapus ","Xalov ","Eter ","Thioclite ","Bepiria ","Gevonus ","Llyke IAN ","Bade M0J ",
	"Cinnoinus ","Cunkianope ","Yilnoth ","Pinonoe ","Ziruta ","Seutis ","Boegantu ","Cholaturn ","Brorth 1O2K ","Lion 0TJ ",
	"Pivolea ","Ustrougawa ","Rulurn ","Nitrone ","Teliv ","Yiathea ","Durustea ","Chorunerth ","Llone LE ","Dion 3J9 ",
	"Chugraonerth ","Thunkoanus ","Adoria ","Sebion ","Patania ","Daezuno ","Brubunerth ","Veoturn ","Gnilia NWC6 ","Merth 2 ",
	"Macriater ","Ochietune ","Nilmilles ","Ivides ","Zayama ","Kiatera ","Thuguwei ","Sodurus ","Zoria 68I7 ","Strara 65 ",
	"Uphawei ","Ragaoliv ","Thobrars ","Xelnides ","Kiophus ","Hihiri ","Bruchatis ","Viohiri ","Grade U3J6 ","Pharth 538 ",
	"Habbeicury ","Yenkucarro ","Killurn ","Enrypso ","Gomia ","Yuemia ","Phinorus ","Meuturn ","Pheshan 50N ","Trorix 52J1 ",
	"Ebiria ","Agaonus ","Ilvara ","Donade ","Unus ","Chainides ","Gnamatera ","Triyutune ","Gore 5AU ","Ninda 0",
	"Oleliv ","Godriumia ","Holvilia ","Dengosie ","Uecury ","Oulea ","Seranides ","Gupuclite ","Criri LS2 ","Cichi 12S0"
];
starNames = [
	"Icush","Joap","Seosh","Icoft","Croap","Prioyo","Plesius","Ophaesdas","Efaugret","Yaitroft",
	"Atrams","Avroans","Fe","Vruak","Ehai","Ojabruab","Shioxas","Bruxeay","Vraisruk","Foyeon",
	"Zlal","Saict","Fauy","Enooc","Paol","Zrizdea","Chagroys","Togrook","Srekseel","Chakum",
	"Daekt","Prud","Vlok","Ipleu","Uvriobsob","Miotteb","Kriokdo","Acuvrukt","Clothuh","Asru",
	"Jalt","Taeklo"
];
galaxyNames = ["Lyra Porphyrion","Nemesis","Alpha Ichnaea","Achelois","Librae","Leporis","Omicron"];
planetsPerSystem = [
	[2,3,5,5,3,5],
	[3,4,2,4],
	[3,4,4,4,2,4,5,5],
	[5,4,3,4,2],
	[2,5,3,4,5,2,3],
	[4,3,2,3,5,4],
	[5,2,3,4,2,4]
];
systemLocations = [
	[
		[544, 307],
		[290, 233],
		[439, 165],
		[349, 367],
		[283, 104],
		[552, 149],
	],[
		[523, 212],
		[434, 333],
		[246, 297],
		[410, 56]
	],[
		[566, 268],
		[264, 301],
		[512, 127],
		[407, 314],
		[248, 138],
		[417, 77],
		[477, 237],
		[397, 377]
	],[
		[335, 294],
		[424, 155],
		[389, 375],
		[292, 98],
		[550, 150]
	],[
		[507, 252],
		[311, 210],
		[391, 282],
		[279, 260],
		[492, 129],
		[354, 87],
		[449, 369]
	],[
		[538, 266],
		[330, 274],
		[431, 137],
		[361, 376],
		[282, 121],
		[489, 104]
	],[
		[581, 265],
		[236, 305],
		[388, 60],
		[345, 286],
		[356, 184],
		[536, 181]
	]
];
partCosts = [ //Steel, Titanium, Tungsten, Silicon
	[900,0,0,100], //Command Module
	[0,0,0,0], //Ammo
	[1750,0,0,50], //Living Quarters
	[10,0,0,0], //Food
	[0,0,0,0], //Water
	[700,0,200,0], //Small Gun
	[100,0,350,0], //Small Engine
	[0,0,0,0], //Medium Engine
	[500,500,0,0], //Fuel
	[0,0,0,0] //Cargo
];