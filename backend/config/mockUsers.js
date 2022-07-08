const mockUsers = [
  { name: 'Phil Turfin', email: 'pturfin0@ft.com', password: 'password' },
  { name: 'Imelda Sherston', email: 'isherston1@odnoklassniki.ru', password: 'password' },
  { name: 'Jennilee Frise', email: 'jfrise2@t.co', password: 'password' },
  { name: 'Dew Samsin', email: 'dsamsin3@sourceforge.net', password: 'password' },
  {
    name: 'Harrietta Eccleston',
    email: 'heccleston4@chronoengine.com',
    password: 'password',
  },
  { name: 'Elyssa Klemz', email: 'eklemz5@google.co.jp', password: 'password' },
  {
    name: 'Arlyn Brooker',
    email: 'abrooker0@geocities.com',
    password: 'password',
  },
  {
    name: 'Barde Hardwell',
    email: 'bhardwell1@themeforest.net',
    password: 'password',
  },
  {
    name: 'Elnore Gerwood',
    email: 'egerwood2@cbslocal.com',
    password: 'password',
  },
  {
    name: 'Tammi Whordley',
    email: 'twhordley3@discovery.com',
    password: 'password',
  },
  {
    name: 'Bastian McElane',
    email: 'bmcelane4@drupal.org',
    password: 'password',
  },
  {
    name: 'Silvana Tommei',
    email: 'stommei5@europa.eu',
    password: 'password',
  },
  {
    name: 'Abbot Boadby',
    email: 'aboadby6@netvibes.com',
    password: 'password',
  },
  {
    name: 'Alikee Adolphine',
    email: 'aadolphine7@nationalgeographic.com',
    password: 'password',
  },
  {
    name: 'Sylas Tregea',
    email: 'stregea8@hp.com',
    password: 'password',
  },
  {
    name: 'Debor Norville',
    email: 'dnorville9@china.com.cn',
    password: 'password',
  },
  {
    name: 'Fleming Gunnell',
    email: 'fgunnella@newsvine.com',
    password: 'password',
  },
  {
    name: 'Samantha Buglass',
    email: 'sbuglassb@answers.com',
    password: 'password',
  },
  {
    name: 'Leroi Ramirez',
    email: 'lramirezc@gov.uk',
    password: 'password',
  },
  {
    name: 'Danyelle Janos',
    email: 'djanosd@plala.or.jp',
    password: 'password',
  },
  {
    name: 'Putnam Baudinelli',
    email: 'pbaudinellie@xing.com',
    password: 'password',
  },
  {
    name: 'Karol McGlaud',
    email: 'kmcglaudf@yale.edu',
    password: 'password',
  },
  {
    name: 'Chloette Aslett',
    email: 'caslettg@flickr.com',
    password: 'password',
  },
  {
    name: 'Luisa Abeles',
    email: 'labelesh@berkeley.edu',
    password: 'password',
  },
  {
    name: 'Papagena Stappard',
    email: 'pstappardi@smugmug.com',
    password: 'password',
  },
  {
    name: 'Thornie Whiten',
    email: 'twhitenj@vinaora.com',
    password: 'password',
  },
  {
    name: 'Skelly Burfoot',
    email: 'sburfootk@bizjournals.com',
    password: 'password',
  },
  {
    name: 'Sonja Tubbs',
    email: 'stubbsl@comcast.net',
    password: 'password',
  },
  {
    name: 'Rees Mayward',
    email: 'rmaywardm@google.es',
    password: 'password',
  },
  {
    name: 'Kerry Avrahamov',
    email: 'kavrahamovn@patch.com',
    password: 'password',
  },
  {
    name: 'Renell Basnett',
    email: 'rbasnetto@tuttocitta.it',
    password: 'password',
  },
  {
    name: 'Llywellyn Westgate',
    email: 'lwestgatep@technorati.com',
    password: 'password',
  },
  {
    name: 'Patricia Bernadon',
    email: 'pbernadonq@newsvine.com',
    password: 'password',
  },
  {
    name: 'Harriett Esson',
    email: 'hessonr@dailymotion.com',
    password: 'password',
  },
  {
    name: 'Wylma Alywin',
    email: 'walywins@psu.edu',
    password: 'password',
  },
  {
    name: 'Emelen Lucy',
    email: 'elucyt@discuz.net',
    password: 'password',
  },
  {
    name: 'Timmie Lumbers',
    email: 'tlumbersu@eventbrite.com',
    password: 'password',
  },
  {
    name: 'Rosina Ikringill',
    email: 'rikringillv@wikipedia.org',
    password: 'password',
  },
  {
    name: 'Rosanna Jury',
    email: 'rjuryw@about.com',
    password: 'password',
  },
  {
    name: 'Duane Berrey',
    email: 'dberreyx@goodreads.com',
    password: 'password',
  },
  {
    name: 'Gregor Akaster',
    email: 'gakastery@elegantthemes.com',
    password: 'password',
  },
  {
    name: "Laureen O'Hallihane",
    email: 'lohallihanez@bbb.org',
    password: 'password',
  },
  {
    name: 'Sindee Vedeneev',
    email: 'svedeneev10@yandex.ru',
    password: 'password',
  },
  {
    name: 'Walker Gasker',
    email: 'wgasker11@webnode.com',
    password: 'password',
  },
  {
    name: 'Tan Burleigh',
    email: 'tburleigh12@google.fr',
    password: 'password',
  },
  {
    name: 'Heddie Beldan',
    email: 'hbeldan13@slashdot.org',
    password: 'password',
  },
  {
    name: 'Farrah Beine',
    email: 'fbeine14@smugmug.com',
    password: 'password',
  },
  {
    name: 'Rafferty Sangwine',
    email: 'rsangwine15@yelp.com',
    password: 'password',
  },
  {
    name: 'Denys Brumbie',
    email: 'dbrumbie16@hubpages.com',
    password: 'password',
  },
  {
    name: 'Si Marieton',
    email: 'smarieton17@mozilla.org',
    password: 'password',
  },
  {
    name: 'Jamal Petley',
    email: 'jpetley18@dion.ne.jp',
    password: 'password',
  },
  {
    name: 'Loise Guillou',
    email: 'lguillou19@harvard.edu',
    password: 'password',
  },
  {
    name: 'Uriel Midner',
    email: 'umidner1a@ucsd.edu',
    password: 'password',
  },
  {
    name: 'Zeb Sturt',
    email: 'zsturt1b@economist.com',
    password: 'password',
  },
  {
    name: 'Lazar Willerson',
    email: 'lwillerson1c@usatoday.com',
    password: 'password',
  },
  {
    name: 'Florina Poate',
    email: 'fpoate1d@dyndns.org',
    password: 'password',
  },
  {
    name: 'Georgy Flockhart',
    email: 'gflockhart1e@naver.com',
    password: 'password',
  },
  {
    name: 'Buck Thyer',
    email: 'bthyer1f@com.com',
    password: 'password',
  },
  {
    name: 'Caren Audrey',
    email: 'caudrey1g@uol.com.br',
    password: 'password',
  },
  {
    name: 'Dur Munslow',
    email: 'dmunslow1h@github.com',
    password: 'password',
  },
  {
    name: 'Shoshana Gillhespy',
    email: 'sgillhespy1i@youtu.be',
    password: 'password',
  },
  {
    name: 'Waneta Baroc',
    email: 'wbaroc1j@indiegogo.com',
    password: 'password',
  },
  {
    name: 'Susann Antoniou',
    email: 'santoniou1k@hhs.gov',
    password: 'password',
  },
  {
    name: 'Belle Tratton',
    email: 'btratton1l@hp.com',
    password: 'password',
  },
  {
    name: 'Boot Wyndham',
    email: 'bwyndham1m@cdc.gov',
    password: 'password',
  },
  {
    name: 'Johna Kyle',
    email: 'jkyle1n@dyndns.org',
    password: 'password',
  },
  {
    name: 'Steffi Ackhurst',
    email: 'sackhurst1o@livejournal.com',
    password: 'password',
  },
  {
    name: 'Lilli Hierro',
    email: 'lhierro1p@so-net.ne.jp',
    password: 'password',
  },
  {
    name: 'Sela Ungaretti',
    email: 'sungaretti1q@plala.or.jp',
    password: 'password',
  },
  {
    name: 'Granville Klimkiewich',
    email: 'gklimkiewich1r@php.net',
    password: 'password',
  },
  {
    name: 'Bobbi Piesold',
    email: 'bpiesold1s@webmd.com',
    password: 'password',
  },
  {
    name: 'Enos Filon',
    email: 'efilon1t@reverbnation.com',
    password: 'password',
  },
  {
    name: 'Mario Berrisford',
    email: 'mberrisford1u@jigsy.com',
    password: 'password',
  },
  {
    name: 'Kendell Wildber',
    email: 'kwildber1v@gov.uk',
    password: 'password',
  },
  {
    name: 'Kala Rix',
    email: 'krix1w@vk.com',
    password: 'password',
  },
  {
    name: 'Cal Christoffe',
    email: 'cchristoffe1x@time.com',
    password: 'password',
  },
  {
    name: 'Nadine Dyne',
    email: 'ndyne1y@wordpress.org',
    password: 'password',
  },
  {
    name: 'Dietrich Eskriet',
    email: 'deskriet1z@unc.edu',
    password: 'password',
  },
  {
    name: 'Titos Busfield',
    email: 'tbusfield20@apple.com',
    password: 'password',
  },
  {
    name: 'Wright Wright',
    email: 'wwright21@freewebs.com',
    password: 'password',
  },
  {
    name: 'Jean Manktelow',
    email: 'jmanktelow22@dailymotion.com',
    password: 'password',
  },
  {
    name: 'Heloise Pevsner',
    email: 'hpevsner23@tinypic.com',
    password: 'password',
  },
  {
    name: 'Sandy Ackwood',
    email: 'sackwood24@mozilla.org',
    password: 'password',
  },
  {
    name: 'Olly Reay',
    email: 'oreay25@nydailynews.com',
    password: 'password',
  },
  {
    name: 'Goldie Marmon',
    email: 'gmarmon26@twitpic.com',
    password: 'password',
  },
  {
    name: 'Tina Cluett',
    email: 'tcluett27@dedecms.com',
    password: 'password',
  },
  {
    name: 'Clair Grassick',
    email: 'cgrassick28@alexa.com',
    password: 'password',
  },
  {
    name: 'Ellerey Reditt',
    email: 'ereditt29@stumbleupon.com',
    password: 'password',
  },
  {
    name: 'Filide Argente',
    email: 'fargente2a@ucla.edu',
    password: 'password',
  },
  {
    name: 'Tara Yegoshin',
    email: 'tyegoshin2b@usda.gov',
    password: 'password',
  },
  {
    name: 'Tybie Scroggs',
    email: 'tscroggs2c@weibo.com',
    password: 'password',
  },
  {
    name: 'Clem Faragan',
    email: 'cfaragan2d@webeden.co.uk',
    password: 'password',
  },
  {
    name: 'Sam Pottell',
    email: 'spottell2e@narod.ru',
    password: 'password',
  },
  {
    name: 'Maury Kiffe',
    email: 'mkiffe2f@printfriendly.com',
    password: 'password',
  },
  {
    name: 'Jess Maidens',
    email: 'jmaidens2g@dmoz.org',
    password: 'password',
  },
  {
    name: 'Shantee Georgeou',
    email: 'sgeorgeou2h@adobe.com',
    password: 'password',
  },
  {
    name: 'Reinaldos Meconi',
    email: 'rmeconi2i@dyndns.org',
    password: 'password',
  },
  {
    name: 'Ody Dizlie',
    email: 'odizlie2j@eepurl.com',
    password: 'password',
  },
  {
    name: 'Suzann Heynel',
    email: 'sheynel2k@cbslocal.com',
    password: 'password',
  },
  {
    name: 'Nan Tootell',
    email: 'ntootell2l@icio.us',
    password: 'password',
  },
  {
    name: 'Abbe Holyard',
    email: 'aholyard2m@hp.com',
    password: 'password',
  },
  {
    name: 'Vaughan Toffoloni',
    email: 'vtoffoloni2n@i2i.jp',
    password: 'password',
  },
  {
    name: 'Emile Adrienne',
    email: 'eadrienne2o@cafepress.com',
    password: 'password',
  },
  {
    name: 'Lisabeth Cowlam',
    email: 'lcowlam2p@cbc.ca',
    password: 'password',
  },
  {
    name: 'Shawna Lecky',
    email: 'slecky2q@plala.or.jp',
    password: 'password',
  },
  {
    name: 'Sean Koopman',
    email: 'skoopman2r@globo.com',
    password: 'password',
  },
];

module.exports = mockUsers;
