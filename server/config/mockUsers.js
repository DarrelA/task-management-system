// prettier-ignore
const mockUsers = [
  { username: 'Florina Poate', email: 'fpoate1d@dyndns.org', password: 'password' },
  { username: 'Georgy Flockhart', email: 'gflockhart1e@naver.com', password: 'password' },
  { username: 'Jess Maidens', email: 'jmaidens2g@dmoz.org', password: 'password' },
  // { username: 'Phil Turfin', email: 'pturfin0@ft.com', password: 'password' },
  // { username: 'Imelda Sherston', email: 'isherston1@odnoklassniki.ru', password: 'password' },
  // { username: 'Jennilee Frise', email: 'jfrise2@t.co', password: 'password' },
  // { username: 'Dew Samsin', email: 'dsamsin3@sourceforge.net', password: 'password' },
  // { username: 'Harrietta Eccleston', email: 'heccleston4@chronoengine.com', password: 'password' },
  // { username: 'Elyssa Klemz', email: 'eklemz5@google.co.jp', password: 'password' },
  // { username: 'Arlyn Brooker', email: 'abrooker0@geocities.com', password: 'password' },
  // { username: 'Barde Hardwell', email: 'bhardwell1@themeforest.net', password: 'password' },
  // { username: 'Elnore Gerwood', email: 'egerwood2@cbslocal.com', password: 'password' },
  // { username: 'Tammi Whordley', email: 'twhordley3@discovery.com', password: 'password' },
  // { username: 'Bastian McElane', email: 'bmcelane4@drupal.org', password: 'password' },
  // { username: 'Silvana Tommei', email: 'stommei5@europa.eu', password: 'password' },
  // { username: 'Abbot Boadby', email: 'aboadby6@netvibes.com', password: 'password' },
  // { username: 'Alikee Adolphine', email: 'aadolphine7@nationalgeographic.com', password: 'password' },
  // { username: 'Sylas Tregea', email: 'stregea8@hp.com', password: 'password' },
  // { username: 'Debor Norville', email: 'dnorville9@china.com.cn', password: 'password' },
  // { username: 'Fleming Gunnell', email: 'fgunnella@newsvine.com', password: 'password' },
  // { username: 'Samantha Buglass', email: 'sbuglassb@answers.com', password: 'password' },
  // { username: 'Leroi Ramirez', email: 'lramirezc@gov.uk', password: 'password' },
  // { username: 'Danyelle Janos', email: 'djanosd@plala.or.jp', password: 'password' },
  // { username: 'Putnam Baudinelli', email: 'pbaudinellie@xing.com', password: 'password' },
  // { username: 'Karol McGlaud', email: 'kmcglaudf@yale.edu', password: 'password' },
  // { username: 'Chloette Aslett', email: 'caslettg@flickr.com', password: 'password' },
  // { username: 'Luisa Abeles', email: 'labelesh@berkeley.edu', password: 'password' },
  // { username: 'Papagena Stappard', email: 'pstappardi@smugmug.com', password: 'password' },
  // { username: 'Thornie Whiten', email: 'twhitenj@vinaora.com', password: 'password' },
  // { username: 'Skelly Burfoot', email: 'sburfootk@bizjournals.com', password: 'password' },
  // { username: 'Sonja Tubbs', email: 'stubbsl@comcast.net', password: 'password' },
  // { username: 'Rees Mayward', email: 'rmaywardm@google.es', password: 'password' },
  // { username: 'Kerry Avrahamov', email: 'kavrahamovn@patch.com', password: 'password' },
  // { username: 'Renell Basnett', email: 'rbasnetto@tuttocitta.it', password: 'password' },
  // { username: 'Llywellyn Westgate', email: 'lwestgatep@technorati.com', password: 'password' },
  // { username: 'Patricia Bernadon', email: 'pbernadonq@newsvine.com', password: 'password' },
  // { username: 'Harriett Esson', email: 'hessonr@dailymotion.com', password: 'password' },
  // { username: 'Wylma Alywin', email: 'walywins@psu.edu', password: 'password' },
  // { username: 'Emelen Lucy', email: 'elucyt@discuz.net', password: 'password' },
  // { username: 'Timmie Lumbers', email: 'tlumbersu@eventbrite.com', password: 'password' },
  // { username: 'Rosina Ikringill', email: 'rikringillv@wikipedia.org', password: 'password' },
  // { username: 'Rosanna Jury', email: 'rjuryw@about.com', password: 'password' },
  // { username: 'Duane Berrey', email: 'dberreyx@goodreads.com', password: 'password' },
  // { username: 'Gregor Akaster', email: 'gakastery@elegantthemes.com', password: 'password' },
  // { username: "Laureen O'Hallihane", email: 'lohallihanez@bbb.org', password: 'password' },
  // { username: 'Sindee Vedeneev', email: 'svedeneev10@yandex.ru', password: 'password' },
  // { username: 'Walker Gasker', email: 'wgasker11@webnode.com', password: 'password' },
  // { username: 'Tan Burleigh', email: 'tburleigh12@google.fr', password: 'password' },
  // { username: 'Heddie Beldan', email: 'hbeldan13@slashdot.org', password: 'password' },
  // { username: 'Farrah Beine', email: 'fbeine14@smugmug.com', password: 'password' },
  // { username: 'Rafferty Sangwine', email: 'rsangwine15@yelp.com', password: 'password' },
  // { username: 'Denys Brumbie', email: 'dbrumbie16@hubpages.com', password: 'password' },
  // { username: 'Si Marieton', email: 'smarieton17@mozilla.org', password: 'password' },
  // { username: 'Jamal Petley', email: 'jpetley18@dion.ne.jp', password: 'password' },
  // { username: 'Loise Guillou', email: 'lguillou19@harvard.edu', password: 'password' },
  // { username: 'Uriel Midner', email: 'umidner1a@ucsd.edu', password: 'password' },
  // { username: 'Zeb Sturt', email: 'zsturt1b@economist.com', password: 'password' },
  // { username: 'Lazar Willerson', email: 'lwillerson1c@usatoday.com', password: 'password' },
  // { username: 'Buck Thyer', email: 'bthyer1f@com.com', password: 'password' },
  // { username: 'Caren Audrey', email: 'caudrey1g@uol.com.br', password: 'password' },
  // { username: 'Dur Munslow', email: 'dmunslow1h@github.com', password: 'password' },
  // { username: 'Shoshana Gillhespy', email: 'sgillhespy1i@youtu.be', password: 'password' },
  // { username: 'Waneta Baroc', email: 'wbaroc1j@indiegogo.com', password: 'password' },
  // { username: 'Susann Antoniou', email: 'santoniou1k@hhs.gov', password: 'password' },
  // { username: 'Belle Tratton', email: 'btratton1l@hp.com', password: 'password' },
  // { username: 'Boot Wyndham', email: 'bwyndham1m@cdc.gov', password: 'password' },
  // { username: 'Johna Kyle', email: 'jkyle1n@dyndns.org', password: 'password' },
  // { username: 'Steffi Ackhurst', email: 'sackhurst1o@livejournal.com', password: 'password' },
  // { username: 'Lilli Hierro', email: 'lhierro1p@so-net.ne.jp', password: 'password' },
  // { username: 'Sela Ungaretti', email: 'sungaretti1q@plala.or.jp', password: 'password' },
  // { username: 'Granville Klimkiewich', email: 'gklimkiewich1r@php.net', password: 'password' },
  // { username: 'Bobbi Piesold', email: 'bpiesold1s@webmd.com', password: 'password' },
  // { username: 'Enos Filon', email: 'efilon1t@reverbnation.com', password: 'password' },
  // { username: 'Mario Berrisford', email: 'mberrisford1u@jigsy.com', password: 'password' },
  // { username: 'Kendell Wildber', email: 'kwildber1v@gov.uk', password: 'password' },
  // { username: 'Kala Rix', email: 'krix1w@vk.com', password: 'password' },
  // { username: 'Cal Christoffe', email: 'cchristoffe1x@time.com', password: 'password' },
  // { username: 'Nadine Dyne', email: 'ndyne1y@wordpress.org', password: 'password' },
  // { username: 'Dietrich Eskriet', email: 'deskriet1z@unc.edu', password: 'password' },
  // { username: 'Titos Busfield', email: 'tbusfield20@apple.com', password: 'password' },
  // { username: 'Wright Wright', email: 'wwright21@freewebs.com', password: 'password' },
  // { username: 'Jean Manktelow', email: 'jmanktelow22@dailymotion.com', password: 'password' },
  // { username: 'Heloise Pevsner', email: 'hpevsner23@tinypic.com', password: 'password' },
  // { username: 'Sandy Ackwood', email: 'sackwood24@mozilla.org', password: 'password' },
  // { username: 'Olly Reay', email: 'oreay25@nydailynews.com', password: 'password' },
  // { username: 'Goldie Marmon', email: 'gmarmon26@twitpic.com', password: 'password' },
  // { username: 'Tina Cluett', email: 'tcluett27@dedecms.com', password: 'password' },
  // { username: 'Clair Grassick', email: 'cgrassick28@alexa.com', password: 'password' },
  // { username: 'Ellerey Reditt', email: 'ereditt29@stumbleupon.com', password: 'password' },
  // { username: 'Filide Argente', email: 'fargente2a@ucla.edu', password: 'password' },
  // { username: 'Tara Yegoshin', email: 'tyegoshin2b@usda.gov', password: 'password' },
  // { username: 'Tybie Scroggs', email: 'tscroggs2c@weibo.com', password: 'password' },
  // { username: 'Clem Faragan', email: 'cfaragan2d@webeden.co.uk', password: 'password' },
  // { username: 'Sam Pottell', email: 'spottell2e@narod.ru', password: 'password' },
  // { username: 'Maury Kiffe', email: 'mkiffe2f@printfriendly.com', password: 'password' },
  // { username: 'Shantee Georgeou', email: 'sgeorgeou2h@adobe.com', password: 'password' },
  // { username: 'Reinaldos Meconi', email: 'rmeconi2i@dyndns.org', password: 'password' },
  // { username: 'Ody Dizlie', email: 'odizlie2j@eepurl.com', password: 'password' },
  // { username: 'Suzann Heynel', email: 'sheynel2k@cbslocal.com', password: 'password' },
  // { username: 'Nan Tootell', email: 'ntootell2l@icio.us', password: 'password' },
  // { username: 'Abbe Holyard', email: 'aholyard2m@hp.com', password: 'password' },
  // { username: 'Vaughan Toffoloni', email: 'vtoffoloni2n@i2i.jp', password: 'password' },
  // { username: 'Emile Adrienne', email: 'eadrienne2o@cafepress.com', password: 'password' },
  // { username: 'Lisabeth Cowlam', email: 'lcowlam2p@cbc.ca', password: 'password' },
  // { username: 'Shawna Lecky', email: 'slecky2q@plala.or.jp', password: 'password' },
  // { username: 'Sean Koopman', email: 'skoopman2r@globo.com', password: 'password' },
];

module.exports = mockUsers;
