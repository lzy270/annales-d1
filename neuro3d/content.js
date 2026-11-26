/* Neuro 3D — contenu (cours UE8 du Drive + référentiel CEN) */
(function(){
const {bs,V}=N3;
const C={};N3.C=C;
const S_C="Cours (fiches Drive)",S_CEN="CEN",S_CL="Classique";

/* ---------- structures (module Anatomie) ---------- */
C.INFO={
lobe0:{t:"Lobe frontal",c:"#ea8672",d:["Cortex moteur primaire (aire 4, gyrus précentral) ; aires prémotrice et motrice supplémentaire (aire 6) : programmation du mouvement.","Aire de Broca (expression du langage, hémisphère dominant) ; cortex préfrontal : comportement, fonctions exécutives.","Séparé du pariétal par le sillon central (Rolando) et du temporal par le sillon latéral (Sylvius)."],v:"ACA (face médiale, jambe) + ACM (face latérale, bras et face).",p:"Homonculus moteur : le membre inférieur est sur la face médiale (ACA), la face et la main sur la face latérale (ACM).",s:S_C},
lobe1:{t:"Lobe pariétal",c:"#79b6e6",d:["Cortex somesthésique primaire (gyrus post-central, aires 3-1-2) : sensibilité controlatérale.","Intégration visuo-spatiale ; l'atteinte de l'hémisphère mineur (droit) donne héminégligence et anosognosie."],v:"ACM (superficielle) ; zone jonctionnelle ACA/ACM en haut, ACM/ACP en arrière.",p:"Le sillon central sépare frontal moteur (en avant) et pariétal sensitif (en arrière).",s:S_C},
lobe2:{t:"Lobe temporal",c:"#8cd08a",d:["Cortex auditif primaire ; aire de Wernicke (compréhension du langage, hémisphère dominant).","Face interne : hippocampe et amygdale (système limbique, mémoire).","Boucle de Meyer des radiations optiques : lésion = quadranopsie latérale homonyme supérieure."],v:"ACM (face latérale) ; ACP (face inférieure et interne).",p:"Hippocampe = mémoire (atrophié dans l'Alzheimer).",s:S_C},
lobe3:{t:"Lobe occipital",c:"#e8c45c",d:["Cortex visuel primaire V1 (berges de la scissure calcarine).","Reçoit les radiations optiques issues du corps genouillé latéral."],v:"ACP.",p:"Lésion de V1 ou occlusion de l'ACP : hémianopsie latérale homonyme controlatérale (macula souvent épargnée).",s:S_CEN},
neo:{t:"Néocérébellum (hémisphères)",c:"#d5a46f",d:["Coordination des mouvements volontaires ; apprentissage et programmation des mouvements.","Afférences du cortex (via le pont, pédoncule moyen) ; noyau dentelé.","Syndrome cinétique : dysmétrie, adiadococinésie, tremblement intentionnel."],v:"PICA (vertébrale), AICA et SCA (basilaire).",p:"Cervelet = contrôle homolatéral (double décussation) : lésion droite → signes à droite.",s:S_C},
vermis:{t:"Paléocervelet (vermis et zone paravermienne)",c:"#c9824f",d:["Tonus et posture axiale ; afférences médullaires (pédoncule inférieur) ; noyau globuleux.","Lésion du vermis : syndrome statique, démarche ébrieuse, élargissement du polygone de sustentation."],v:"PICA, SCA.",p:"Vermis = statique (ébrieux) ; hémisphère = cinétique (dysmétrie).",s:S_C},
archeo:{t:"Archéocervelet (lobe flocculo-nodulaire)",c:"#9b6bd1",d:["Équilibre : afférences vestibulaires ; noyau fastigial.","Lésion : syndrome vestibulo-cérébelleux (instabilité, nystagmus)."],v:"PICA, AICA.",p:"Archéo = équilibre, paléo = tonus, néo = coordination.",s:S_C},
ped:{t:"Pédoncules cérébelleux",c:"#58a6e0",d:["Inférieur : afférences de la moelle (proprioception inconsciente) et du bulbe.","Moyen : afférences du cortex via la protubérance (le plus gros).","Supérieur : efférences vers le thalamus et le cortex (via noyau rouge)."],v:"SCA, AICA.",p:"Sup = sortie ; moyen = cortex ; inf = moelle.",s:S_C},
bs0:{t:"Mésencéphale",c:"#f2a65a",d:["Nerfs III et IV. Pieds des pédoncules cérébraux : faisceau pyramidal (cortico-spinal, central) et cortico-nucléaire.","Substance noire (dopamine) et noyau rouge ; aqueduc de Sylvius ; colliculi (réflexes visuels et auditifs)."],v:"ACP, SCA, branches du tronc basilaire.",p:"Syndrome de Weber : hémiplégie controlatérale + paralysie du III homolatérale.",s:S_C},
bs1:{t:"Pont (protubérance)",c:"#7aa7e8",d:["Nerfs V, VI, VII, VIII. Base du pont : fibres cortico-pontiques et pyramidales.","Relais vers le cervelet par le pédoncule cérébelleux moyen ; lemnisque médian et formation réticulée dans le tegmentum."],v:"Tronc basilaire (artères paramédianes et circonférentielles), AICA.",p:"Occlusion du tronc basilaire : coma, tétraplégie, locked-in syndrome.",s:S_C},
bs2:{t:"Bulbe rachidien",c:"#8fd18b",d:["Nerfs IX, X, XI, XII. Pyramides : décussation de 90 % des fibres pyramidales au tiers inférieur.","Noyaux gracile et cunéiforme : relais de la voie lemniscale, avec décussation sensitive.","Centres vitaux : respiration, cardio-vasculaire."],v:"Vertébrales, PICA (face latérale), artère spinale antérieure (face médiale).",p:"Lemniscale : décusse dans le bulbe ; spino-thalamique : décusse dans la moelle.",s:S_C},
bs3:{t:"Moelle épinière",c:"#f0d98a",d:["De C1 à L1-L2 (cône terminal) puis filum terminal ; 31 paires de nerfs spinaux.","Substance grise en papillon : cornes dorsales (sensitives), ventrales (motrices). Ponction lombaire en L4-L5, sous la moelle.","(Ici raccourcie pour l'affichage.)"],v:"Artère spinale antérieure et artères spinales postérieures.",p:"Queue de cheval : atteinte périphérique, ROT abolis, urgence neurochirurgicale.",s:S_C},
thalamus:{t:"Thalamus",c:"#e6a77a",d:["Relais de toutes les voies sensitives avant le cortex (noyau VPL pour la sensibilité somatique) ; relais moteur (VA, VL) dans les circuits des ganglions de la base et du cervelet.","Corps genouillé latéral = relais visuel."],v:"ACP (artères thalamo-perforantes et thalamo-genouillées).",p:"Lésion thalamique : troubles sensitifs controlatéraux (ACP).",s:S_C},
caude:{t:"Noyau caudé",c:"#7bc4a8",d:["Tête, corps et queue en C autour du thalamus, le long du ventricule latéral.","Striatum = caudé + putamen : entrée des ganglions de la base."],v:"ACA (Heubner, partie haute) et ACM profonde.",p:"Striatum = caudé + lenticulaire (putamen + pallidum), pas seulement le caudé.",s:S_C},
lenticulaire:{t:"Putamen (noyau lenticulaire)",c:"#e58f9f",d:["Putamen + pallidum = noyau lenticulaire, en dehors de la capsule interne.","Circuit direct (D1, active le mouvement) et indirect (D2, freine) : la dopamine active la directe et inhibe l'indirecte."],v:"ACM profonde : artères lenticulo-striées (terminales).",p:"Artères terminales sans anastomose : infarctus lacunaires.",s:S_C},
pallidum:{t:"Pallidum (GPe / GPi)",c:"#d1596f",d:["GPi : sortie inhibitrice vers le thalamus ; GPe : relais de la voie indirecte.","Parkinson : perte de dopamine (substance noire compacte) → voie directe ↓, indirecte ↑ → hypokinésie ; traitement : L-dopa."],v:"GPe : ACM ; GPi : choroïdienne antérieure.",p:"Voie directe = accélérateur ; indirecte = frein.",s:S_C},
capsule:{t:"Capsule interne",c:"#f2e2a0",d:["Entre le lenticulaire (en dehors) et le caudé + thalamus (en dedans) ; en V ouvert en dehors : bras antérieur, genou, bras postérieur.","Genou : faisceau géniculé (cortico-nucléaire) → face. Bras postérieur : faisceau cortico-spinal, et fibres sensitives thalamo-corticales."],v:"Bras antérieur : ACA (Heubner) / ACM profonde ; genou : choroïdienne antérieure ; bras postérieur : lenticulo-striées / choroïdienne antérieure.",p:"Fibres très groupées : une petite lésion donne une hémiplégie proportionnelle (face, bras, jambe).",s:S_C},
hippocampe:{t:"Hippocampe",c:"#a58bd6",d:["Cortex limbique, face interne du lobe temporal : mémoire épisodique (circuit de Papez : hippocampe, fornix, corps mamillaires, thalamus, cingulaire).","Atrophié dans la maladie d'Alzheimer."],v:"ACP (et choroïdienne antérieure).",p:"Hippocampe = mémoire.",s:S_C},
amygdale:{t:"Corps amygdaloïde",c:"#a58bd6",d:["Système limbique : émotions (peur), réactions végétatives."],v:"Choroïdienne antérieure.",p:"",s:S_C},
calleux:{t:"Corps calleux",c:"#f4f0e6",d:["Principale commissure inter-hémisphérique (genou, corps, splénium).","Il est vascularisé en avant par l'ACA, et en arrière (splénium) par l'ACP."],v:"ACA (tête) ; ACP (splénium).",p:"",s:S_C}
};
C.ANAT_LABELS=[["lobe0","Frontal",()=>V(-2,3.8,6)],["lobe1","Pariétal",()=>V(-3,4.6,-2.5)],["lobe2","Temporal",()=>V(-5.2,-2.4,1)],["lobe3","Occipital",()=>V(-3,1.8,-8)],["neo","Cervelet",()=>V(-3.5,-5.8,-6)],["bs0","Mésencéphale",()=>bs(-1.1,1,0)],["bs1","Pont",()=>bs(-1.5,3,.5)],["bs2","Bulbe",()=>bs(-1.0,5.4,0)],["bs3","Moelle",()=>bs(-.7,10,0)]];

/* ---------- artères (module Vascularisation) ---------- */
const m=(s,pts)=>pts.map(p=>[p[0]*s,p[1],p[2]]);
C.ART=[
{id:"ica",nom:"Carotide interne",r:.2,col:"#d94a3f",pts:[[2.2,-11,1],[2,-8,1],[1.8,-5.5,.8],[1.6,-3.8,.5],[1.5,-2.5,.4]],lab:[1.9,-6,.9],
 d:"Naît de la carotide commune (bifurcation en C3-C4), n'a aucune collatérale au cou, entre dans le rocher (canal carotidien), traverse le sinus caverneux. Ses branches : ophtalmique, communicante postérieure, choroïdienne antérieure, puis elle se termine en ACM et ACA.",
 occ:{down:["ica","aca","acm","acm_sup","lent","achoa","ophth"],terr:[1,1,0],txt:"Infarctus du territoire carotidien : syndrome sylvien (± ACA) avec hémiplégie, aphasie ou négligence, ± cécité monoculaire homolatérale. Suppléance possible par le polygone de Willis (communicantes) : la clinique varie selon l'anatomie.",s:S_C}},
{id:"ophth",nom:"Artère ophtalmique",r:.07,col:"#f26d5b",pts:[[1.5,-2.7,.5],[1.4,-2.9,2.2],[2.2,-3.6,4.6],[3,-4,6.3]],lab:[2.2,-3.6,4.6],
 d:"Première branche de la carotide interne, elle vascularise la rétine (via l'artère centrale de la rétine).",
 occ:{down:["ophth"],terr:[0,0,0],txt:"Cécité monoculaire homolatérale (amaurose), le plus souvent brutale et parfois transitoire. Seule exception : tous les autres déficits corticaux sont controlatéraux.",s:S_CEN}},
{id:"aca",nom:"Artère cérébrale antérieure (ACA)",r:.14,col:"#d6456f",pts:[[1.5,-2.5,.4],[1.2,-2.4,1.4],[.45,-2.3,2.5],[.3,-.5,3.5],[.3,1.9,3.6],[.3,3.5,1.6],[.3,4.1,-1],[.3,3.6,-3.2]],lab:[.4,2.6,3.2],
 d:"Branche de la carotide interne. Elle vascularise la face médiale des lobes frontal et pariétal, la tête du corps calleux, la partie haute du noyau caudé et le bras antérieur de la capsule interne (artère de Heubner).",
 occ:{down:["aca"],terr:[1,0,0],txt:"Déficit moteur à prédominance crurale controlatéral (jambe), avec troubles sensitifs ; syndrome frontal (abulie, dysexécutif). Atteinte bilatérale : mutisme akinétique.",s:S_CEN}},
{id:"acm",nom:"Artère cérébrale moyenne (ACM), tronc",r:.17,col:"#e09a2a",pts:[[1.5,-2.5,.4],[2.5,-2.6,.8],[3.8,-2.3,.9],[4.8,-1,.8]],lab:[3.4,-2.5,.9],
 d:"Le gros territoire : face latérale des hémisphères (frontal, pariétal, temporal, insula). Elle chemine dans la vallée sylvienne. Elle donne les branches superficielles (cortex) et les artères lenticulo-striées (noyaux gris, capsule interne).",
 occ:{down:["acm","acm_sup","lent"],terr:[0,1,0],txt:"Infarctus sylvien total : hémiplégie massive proportionnelle controlatérale (face, bras, jambe), hémihypoesthésie, hémianopsie latérale homonyme ; aphasie si hémisphère dominant (gauche), négligence si droit.",s:S_CEN}},
{id:"acm_sup",nom:"ACM, branches superficielles",r:.1,col:"#e8ab45",multi:[[[4.8,-1,.8],[5.5,1,1.8],[5.1,3.2,2.8]],[[4.8,-1,.8],[6,.6,-.6],[5.6,2.4,-2.2]],[[4.8,-1,.8],[6.2,-.2,-1.6],[5.6,.6,-4.6]],[[4.8,-1,.8],[5.8,.5,3.6],[5.2,1.6,6]]],lab:[5.8,1.2,1.6],
 d:"Elles irriguent la convexité : cortex moteur et sensitif de la face et du bras, aire de Broca (en avant), aire de Wernicke (en arrière, temporal postérieur).",
 occ:{down:["acm_sup"],terr:[0,1,0],txt:"Déficit moteur à prédominance brachio-faciale controlatéral (± sensitif). Hémisphère dominant : aphasie (Broca en avant, Wernicke en arrière). Hémisphère mineur : héminégligence. Une hémianopsie latérale homonyme est possible.",s:S_CEN}},
{id:"lent",nom:"Artères lenticulo-striées (ACM profonde)",r:.05,col:"#f2c14e",multi:[[[3,-2.5,.9],[3.1,-1.6,.8],[3.3,-.3,.6]],[[3.4,-2.4,.9],[3.5,-1.3,.5],[3.6,.2,.3]],[[3.7,-2.3,.9],[3.9,-1.2,.4],[3.9,.1,.1]]],lab:[3.6,-1.2,.5],
 d:"Artères terminales (sans anastomose) vers le noyau lenticulaire, le caudé et le bras postérieur de la capsule interne.",
 occ:{down:["lent"],terr:[0,0,0],tint:"capsule",txt:"Infarctus lacunaire capsulo-lenticulaire : hémiplégie proportionnelle controlatérale (face, bras, jambe) pure ou associée à une hémihypoesthésie. Pas d'aphasie ni de négligence (cortex épargné).",s:S_C}},
{id:"achoa",nom:"Artère choroïdienne antérieure",r:.06,col:"#f08fa3",pts:[[1.65,-2.6,.3],[2.2,-1.9,-.6],[2.9,-1,-.4]],lab:[2.3,-1.8,-.5],
 d:"Branche de la carotide interne : globus pallidus (interne), genou et partie du bras postérieur de la capsule interne, uncus, amygdale, tractus optique, plexus choroïdes.",
 occ:{down:["achoa"],terr:[0,0,0],tint:"capsule",txt:"Hémiplégie controlatérale (faisceau cortico-nucléaire au genou : atteinte faciale) ± hémihypoesthésie ± hémianopsie latérale homonyme (tractus optique).",s:S_C}},
{id:"acomp",nom:"Artère communicante postérieure",r:.06,col:"#b57be0",pts:[[1.5,-2.45,.3],[1.2,-2.3,-.5],[1,-2.3,-.95]],lab:[1.3,-2.3,-.2],
 d:"Relie la carotide interne à l'ACP : suppléance entre circulation antérieure et postérieure.",
 occ:{down:["acomp"],terr:[0,0,0],txt:"Souvent asymptomatique grâce aux autres anastomoses. Elle sert de voie de suppléance entre carotide et vertébro-basilaire.",s:S_C}},
{id:"acp",nom:"Artère cérébrale postérieure (ACP)",r:.14,col:"#2c9d96",pts:[[0,-2.15,-.44],[1,-2.3,-.9],[2.2,-2.2,-2],[2.6,-1.8,-4],[1.5,0,-6.5],[.8,1.5,-7.2]],lab:[2.5,-1.9,-3.4],
 d:"Branche terminale du tronc basilaire (qui se divise en deux ACP). Elle vascularise le lobe occipital, la face inféro-interne du temporal, le thalamus, le noyau sous-thalamique, le corps genouillé latéral et le splénium.",
 occ:{down:["acp"],terr:[0,0,1],txt:"Hémianopsie latérale homonyme controlatérale, souvent isolée ; troubles sensitifs controlatéraux si thalamus. Atteinte bilatérale : cécité corticale.",s:S_CEN}},
{id:"sca",nom:"Artère cérébelleuse supérieure (SCA)",r:.09,col:"#e8a35a",pts:[[0,-2.5,-.7],[1.2,-2.7,-1.5],[2,-3,-2.6],[2.6,-3,-5]],lab:[1.8,-2.9,-2.4],
 d:"Branche haute du tronc basilaire : face supérieure du cervelet.",
 occ:{down:["sca"],terr:[0,0,0],tint:"cereb",txt:"Syndrome cérébelleux homolatéral (ataxie, dysmétrie), troubles de l'équilibre.",s:S_CEN}},
{id:"aica",nom:"Artère cérébelleuse antéro-inférieure (AICA)",r:.09,col:"#e8933a",pts:[[0,-4.7,-1.2],[1.3,-4.8,-1.8],[2,-4.9,-2.3],[3,-4.5,-4]],lab:[2,-4.9,-2.3],
 d:"Branche du tronc basilaire : partie inférieure du pont, flocculus, face antérieure du cervelet ; donne l'artère labyrinthique.",
 occ:{down:["aica"],terr:[0,0,0],tint:"cereb",txt:"Syndrome cérébelleux homolatéral ; atteinte de l'angle ponto-cérébelleux (surdité, vertige, paralysie faciale périphérique homolatérales).",s:S_CL}},
{id:"pica",nom:"Artère cérébelleuse postéro-inférieure (PICA)",r:.09,col:"#e0803a",pts:[[1.1,-6.1,-2],[1.8,-6.5,-3.5],[1.5,-6.2,-5.2],[.8,-5.5,-6.4]],lab:[1.6,-6.4,-4],
 d:"Branche de l'artère vertébrale : face inférieure du cervelet et partie latérale du bulbe.",
 occ:{down:["pica"],terr:[0,0,0],tint:"cereb",txt:"Syndrome de Wallenberg (infarctus bulbaire latéral) : vertige, syndrome vestibulaire et cérébelleux homolatéral, syndrome de Claude Bernard-Horner homolatéral, dysphonie et dysphagie (IX, X), hypoesthésie thermo-algique de la face homolatérale et de l'hémicorps controlatéral. Pas de déficit moteur.",s:S_CEN}},
{id:"vert",nom:"Artère vertébrale",r:.17,col:"#e8833a",pts:[[2.4,-10,-3.8],[1.8,-8,-3],[1.1,-6,-1.95],[0,-5.04,-1.28]],lab:[1.9,-8,-3],
 d:"Branche de la sous-clavière ; entre dans les foramens transverses dès C6 et passe dans le crâne par le foramen magnum. Les deux vertébrales fusionnent en tronc basilaire. Une anastomose avec l'artère occipitale (carotide externe) peut suppléer.",
 occ:{down:["vert","pica"],terr:[0,0,0],tint:"cereb",txt:"Infarctus bulbaire latéral (Wallenberg) ou cérébelleux : vertige, ataxie, Horner, troubles de déglutition ; dissection de la vertébrale possible chez le sujet jeune (cervicalgie, Horner).",s:S_CEN}},
{id:"bas",nom:"Tronc basilaire",r:.21,col:"#e8833a",mid:1,pts:[[0,-5.04,-1.28],[0,-3.6,-.85],[0,-2.15,-.44]],lab:[0,-3.6,-.2],
 d:"Formé par la fusion des deux vertébrales (pas de la carotide), il chemine dans le sillon basilaire du pont et se divise en deux ACP. Il donne les artères du pont, l'AICA et les SCA.",
 occ:{down:["bas","sca","aica","acp"],terr:[0,0,.7],tint:"tronc",txt:"AVC grave du tronc cérébral : coma, atteinte motrice bilatérale, locked-in syndrome (occlusion basse : coma profond). Atteinte des ACP : hémianopsie ou cécité corticale.",s:S_CEN}},
{id:"acom",nom:"Artère communicante antérieure",r:.06,col:"#ee9ac0",mid:1,pts:[[-.45,-2.3,2.5],[.45,-2.3,2.5]],lab:[0,-2.3,2.5],
 d:"Relie les deux ACA : suppléance entre les deux carotides.",
 occ:{down:["acom"],terr:[0,0,0],txt:"Souvent latente. Siège fréquent d'anévrysmes (hémorragie méningée).",s:S_CL}}
];
C.TERR=[["ACA","#ee7f9a","Face médiale : jambe, comportement"],["ACM","#f3b84c","Face latérale : bras, face, langage"],["ACP","#4fb8b1","Occipital, temporal inféro-interne, thalamus : vision"]];

/* ---------- nerfs crâniens ---------- */
C.NC=[
{n:"I",nom:"Olfactif",type:"sens",etage:"Télencéphale",orig:"Bulbe olfactif, sous le lobe frontal (lame criblée de l'ethmoïde).",fn:"Olfaction.",cl:"Anosmie (traumatisme, tumeur du sillon olfactif).",pos:{p:[.9,-2.4,6.6],dir:[0,0,.01]},tip:[.95,-2.35,4.0]},
{n:"II",nom:"Optique",type:"sens",etage:"Diencéphale (chiasma)",orig:"Rétine → canal optique → chiasma → bandelettes.",fn:"Vision.",cl:"Nerf : cécité monoculaire. Chiasma : hémianopsie bitemporale. Après le chiasma : hémianopsie latérale homonyme.",pos:{p:[0,-2.6,2],dir:[0,0,0]},pts:[[0,-2.6,2],[1,-3,3.2],[2.4,-3.7,5.4],[3,-4,6.4]]},
{n:"III",nom:"Oculomoteur commun",type:"mot",etage:"Mésencéphale",orig:"Fosse interpédonculaire.",noy:"Noyau du III et noyau d'Edinger-Westphal (parasympathique).",fn:"Releveur de la paupière, droits supérieur, inférieur et médial, oblique inférieur ; myosis et accommodation.",cl:"Ptosis, mydriase, œil en bas et en dehors (strabisme divergent), diplopie.",bsp:[.55,1.25,.85],dir:[.5,-.15,1],L:2.4},
{n:"IV",nom:"Trochléaire",type:"mot",etage:"Mésencéphale",orig:"Face dorsale du tronc, sous les colliculi inférieurs : le seul à émerger en arrière ; il décusse.",noy:"Noyau du IV.",fn:"Oblique supérieur (œil en bas et en dedans).",cl:"Diplopie verticale (surtout en descendant un escalier), torticolis compensateur.",bsp:[.45,1.7,-.85],dir:[.8,0,.6],L:2.2},
{n:"V",nom:"Trijumeau",type:"mixte",etage:"Pont",orig:"Face latérale du pont (racine sensitive et racine motrice) → ganglion de Gasser.",noy:"Noyau sensitif principal (pont), noyau spinal du V (bulbe, moelle cervicale), noyau mésencéphalique, noyau moteur du V.",fn:"Sensibilité de la face (V1 ophtalmique par la fissure orbitaire supérieure, V2 maxillaire, V3 mandibulaire) ; V3 moteur : muscles masticateurs.",cl:"Hypoesthésie faciale, abolition du réflexe cornéen, faiblesse de la mastication.",bsp:[1.7,3.1,.15],dir:[.8,-.1,.4],L:2.2},
{n:"VI",nom:"Abducens",type:"mot",etage:"Pont (sillon bulbo-protubérantiel)",orig:"Sillon bulbo-protubérantiel, près de la ligne médiane. Seul nerf intra-caverneux (les autres sont dans la paroi latérale du sinus).",noy:"Noyau du VI (pont).",fn:"Droit latéral (abduction de l'œil).",cl:"Diplopie horizontale, œil en adduction (strabisme convergent) ; peut être un signe de fausse localisation en cas d'hypertension intracrânienne.",bsp:[.5,4.2,1],dir:[.1,-.2,1],L:2.6},
{n:"VII",nom:"Facial",type:"mixte",etage:"Pont (sillon bulbo-protubérantiel)",orig:"Angle ponto-cérébelleux ; traverse le rocher puis la parotide.",noy:"Noyau moteur du VII (pont), noyau salivaire supérieur, noyau solitaire (goût).",fn:"Muscles de la mimique ; intermédiaire de Wrisberg : goût des 2/3 antérieurs de la langue, sécrétion lacrymale et salivaire.",cl:"Paralysie faciale périphérique : atteinte du front inclus. Centrale : le haut du visage est épargné (innervation corticale bilatérale).",bsp:[1,4.25,.55],dir:[.9,-.1,.35],L:2.4},
{n:"VIII",nom:"Vestibulo-cochléaire",type:"sens",etage:"Pont (sillon bulbo-protubérantiel)",orig:"Angle ponto-cérébelleux → méat acoustique interne.",noy:"Noyaux cochléaires et vestibulaires.",fn:"Audition (cochlée) et équilibre (vestibule).",cl:"Surdité de perception, acouphènes, vertige, nystagmus ; schwannome vestibulaire de l'angle ponto-cérébelleux.",bsp:[1.3,4.25,.1],dir:[1,-.1,0],L:2.4},
{n:"IX",nom:"Glossopharyngien",type:"mixte",etage:"Bulbe",orig:"Sillon latéral postérieur du bulbe ; sort par le foramen jugulaire.",noy:"Noyau ambigu, noyau solitaire, noyau salivaire inférieur.",fn:"Goût du tiers postérieur de la langue, sensibilité du pharynx (réflexe nauséeux), parotide, muscle stylo-pharyngien.",cl:"Abolition du réflexe nauséeux, trouble de la déglutition (avec le X).",bsp:[.95,5,-.25],dir:[1,-.3,-.2],L:2.2},
{n:"X",nom:"Vague (pneumogastrique)",type:"mixte",etage:"Bulbe",orig:"Sillon latéral postérieur ; foramen jugulaire ; gaine vasculaire du cou.",noy:"Noyau ambigu, noyau dorsal du X, noyau solitaire.",fn:"Motricité du pharynx, du larynx et du voile ; parasympathique thoraco-abdominal. Le récurrent (laryngé inférieur) innerve tous les muscles de la phonation sauf le crico-thyroïdien (laryngé supérieur).",cl:"Dysphonie, dysphagie, déviation de la luette, paralysie d'une corde vocale.",bsp:[.95,5.5,-.25],dir:[1,-.5,-.2],L:2.2},
{n:"XI",nom:"Accessoire (spinal)",type:"mot",etage:"Bulbe et moelle cervicale",orig:"Racines bulbaires et spinales (C1-C5) ; foramen jugulaire.",noy:"Noyau ambigu (bulbaire) et corne ventrale cervicale (spinal).",fn:"Sterno-cléido-mastoïdien (rotation de la tête) et trapèze (épaule).",cl:"Faiblesse de l'épaule (trapèze) et de la rotation de la tête.",bsp:[.95,6,-.25],dir:[1,-.6,-.2],L:2.2},
{n:"XII",nom:"Hypoglosse",type:"mot",etage:"Bulbe",orig:"Sillon pré-olivaire ; canal de l'hypoglosse.",noy:"Noyau du XII.",fn:"Muscles de la langue.",cl:"Déviation de la langue du côté atteint à la protrusion, atrophie, fasciculations.",bsp:[.45,5.4,.7],dir:[.5,-.8,.6],L:2.4}
];
C.NC_NUC=[["III",[.2,.9,-.4]],["IV",[.2,1.6,-.5]],["V",[1,3.1,-.2]],["VI",[.3,3.6,-1]],["VII",[.9,3.8,-.5]],["VIII",[1,4.1,-.9]],["IX",[.7,5,-.3]],["X",[.35,5.4,-.9]],["XI",[.6,6.4,-.2]],["XII",[.2,5.3,-.8]]];
C.NC_COL={sens:"#4aa3f0",mot:"#e55b5b",mixte:"#a46be6"};
C.NC_TYPE={sens:"Sensitif / sensoriel",mot:"Moteur",mixte:"Mixte"};

/* ---------- voies (moteur de lecture pas à pas) ---------- */
const Z=(x,t,a)=>bs(x,t,a);
C.PATHS=[
{id:"motrice",nom:"Voie motrice pyramidale",col:"#ff7a59",cap:"Cortex moteur gauche → hémicorps droit",
 steps:[
 {p:[-3.4,3.9,.9],t:"Cortex moteur primaire (aire 4)",d:"Gyrus précentral : le neurone moteur central (pyramidal). Homonculus : jambe sur la face médiale (ACA), bras et face sur la face latérale (ACM)."},
 {p:[-3.1,2.6,.4],via:1},
 {p:[-3.2,2.1,.1],t:"Couronne rayonnante",d:"Les fibres convergent en éventail vers la capsule interne."},
 {p:[-2.6,.9,-.4],t:"Capsule interne (bras postérieur)",d:"Fibres très groupées : une petite lésion = hémiplégie proportionnelle controlatérale. Le faisceau géniculé (cortico-nucléaire) passe par le genou."},
 {p:Z(-.8,.9,.6),t:"Pied du pédoncule cérébral (mésencéphale)",d:"Faisceau pyramidal dans la partie centrale du pied, cortico-nucléaire en dedans."},
 {p:Z(-.8,3,1.15),t:"Base du pont",d:"Les fibres sont dispersées en petits faisceaux entre les noyaux du pont."},
 {p:Z(-.5,5.2,.85),t:"Pyramide bulbaire",d:"Les fibres se regroupent à nouveau en pyramide, sur la face antérieure du bulbe."},
 {p:Z(0,6.2,.45),t:"Décussation des pyramides",d:"90 % des fibres croisent au tiers inférieur du bulbe : le cortex gauche commande l'hémicorps droit."},
 {p:Z(.55,7.4,.05),via:1},
 {p:Z(.6,9,-.2),t:"Cordon latéral (faisceau cortico-spinal latéral)",d:"Faisceau croisé qui descend dans le cordon latéral de la moelle, du côté controlatéral au cortex."},
 {p:Z(.55,12.4,.25),t:"Corne ventrale : motoneurone α",d:"Synapse avec le motoneurone périphérique (corne ventrale, somatotopie : médial = axial, latéral = distal)."},
 {p:Z(1.5,12.8,.35),via:1},
 {p:Z(3.2,13.4,.3),t:"Nerf périphérique → muscle",d:"Le motoneurone α innerve le muscle (plaque motrice). Une lésion à ce niveau : paralysie flasque, ROT abolis."}],
 les:[
 {l:"Cortex / couronne",step:[0,2],tx:"Hémiparésie controlatérale à prédominance brachio-faciale (ACM) ou crurale (ACA) : syndrome pyramidal controlatéral (spasticité, ROT vifs, Babinski), ± aphasie.",s:S_C},
 {l:"Capsule interne",step:3,tx:"Hémiplégie controlatérale proportionnelle (face, bras et jambe) ± hémihypoesthésie. Typique des infarctus lacunaires (lenticulo-striées, choroïdienne antérieure).",s:S_C},
 {l:"Pédoncule (mésencéphale)",step:4,tx:"Hémiplégie controlatérale + paralysie du III homolatérale : syndrome de Weber (syndrome alterne).",s:S_CL},
 {l:"Pyramide bulbaire",step:6,tx:"Hémiplégie controlatérale respectant la face (la face est innervée plus haut, par le faisceau cortico-nucléaire).",s:S_CL},
 {l:"Moelle (cordon latéral)",step:9,tx:"Syndrome pyramidal homolatéral sous la lésion, car la décussation est déjà faite. Hémisection (Brown-Séquard) : motricité et lemniscal homolatéraux, thermo-algique controlatéral.",s:S_C},
 {l:"Corne ventrale / nerf",step:10,tx:"Atteinte du motoneurone périphérique : paralysie flasque, ROT abolis, amyotrophie, fasciculations (pas de signe pyramidal).",s:S_C}]},
{id:"lemn",nom:"Voie lemniscale",col:"#4cd2e6",cap:"Tact épicritique, proprioception consciente, vibrations (membre inférieur droit)",
 steps:[
 {p:Z(3.2,13.5,.2),t:"Récepteur (pied droit)",d:"Mécanorécepteurs du tact fin, vibrations ; fuseaux et récepteurs articulaires (proprioception)."},
 {p:Z(1.6,12.6,-.2),t:"1er neurone : ganglion spinal",d:"Pseudo-unipolaire ; son prolongement central entre par la racine dorsale."},
 {p:Z(.3,11.5,-.6),t:"Cordon postérieur homolatéral (Goll)",d:"Les fibres du membre inférieur montent sans croiser dans le faisceau gracile de Goll (interne) ; Burdach (externe) pour le membre supérieur."},
 {p:Z(.2,8,-.6),via:1},
 {p:Z(.2,6,-.65),t:"Noyau gracile (bulbe), 2e neurone",d:"Relais dans le noyau gracile (Goll) ou cunéiforme (Burdach)."},
 {p:Z(0,5.4,-.1),t:"Décussation sensitive (fibres arquées internes)",d:"Dans le bulbe : la voie lemniscale décusse haut. Elle forme ensuite le lemnisque médian controlatéral."},
 {p:Z(-.35,4.6,.35),via:1},
 {p:Z(-.45,3.2,.15),t:"Lemnisque médian",d:"Monte dans le tegmentum du tronc cérébral, du côté controlatéral."},
 {p:[-1.5,.4,-.9],t:"Thalamus (VPL), 3e neurone",d:"Relais thalamique avant le cortex somesthésique."},
 {p:[-2.6,1.2,-.8],t:"Capsule interne (bras postérieur)",d:"Les fibres thalamo-corticales sensitives passent dans le bras postérieur."},
 {p:[-3.6,3.6,-.5],t:"Cortex somesthésique primaire (S1)",d:"Gyrus post-central : perception consciente, côté controlatéral au récepteur."}],
 les:[
 {l:"Moelle (cordon postérieur)",step:2,tx:"Abolition du tact fin, des vibrations et de la proprioception du côté homolatéral à la lésion ; la thermo-algésie est conservée. Ataxie proprioceptive, Romberg positif yeux fermés.",s:S_C},
 {l:"Bulbe (lemnisque)",step:5,tx:"Déficit lemniscal controlatéral (après décussation), par exemple dans un syndrome bulbaire médian.",s:S_CL},
 {l:"Thalamus",step:8,tx:"Troubles sensitifs controlatéraux (ACP) : hémi-hypoesthésie, parfois douleurs thalamiques.",s:S_C},
 {l:"Capsule interne",step:9,tx:"Hémihypoesthésie controlatérale, souvent associée à l'hémiplégie (bras postérieur).",s:S_C},
 {l:"Cortex S1",step:10,tx:"Déficit sensitif controlatéral, surtout des modalités discriminatives (stéréognosie, graphesthésie).",s:S_CL}]},
{id:"spino",nom:"Voie spino-thalamique",col:"#ffc24a",cap:"Douleur et température (membre inférieur droit)",
 steps:[
 {p:Z(3.2,13.5,.2),t:"Récepteur (pied droit)",d:"Nocicepteurs et thermorécepteurs : fibres Aδ et C."},
 {p:Z(1.6,12.6,-.2),t:"1er neurone : ganglion spinal",d:"Le prolongement central entre dans la corne dorsale."},
 {p:Z(.45,12.3,-.35),t:"Corne dorsale (relais, 2e neurone)",d:"Substance gélatineuse de Rolando (douleur)."},
 {p:Z(0,12.1,.05),t:"Décussation dans la moelle",d:"Les fibres croisent presque sur place (commissure grise antérieure) : la spino-thalamique décusse dans la moelle, quelques segments plus haut."},
 {p:Z(-.5,10,.05),t:"Cordon antéro-latéral controlatéral",d:"Faisceau spino-thalamique qui monte du côté opposé au récepteur."},
 {p:Z(-.55,7,.1),via:1},
 {p:Z(-.65,4.8,.15),t:"Tronc cérébral (lemnisque spinal)",d:"Il traverse bulbe, pont et mésencéphale ; des collatérales vont à la formation réticulée."},
 {p:Z(-.7,1.8,.15),via:1},
 {p:[-1.7,.5,-1],t:"Thalamus (VPL), 3e neurone",d:"Relais thalamique."},
 {p:[-2.7,1.2,-.9],t:"Capsule interne (bras postérieur)",d:"Voie thalamo-corticale."},
 {p:[-3.55,3.5,-.6],t:"Cortex somesthésique primaire (S1)",d:"Perception de la douleur et de la température, côté controlatéral au récepteur."}],
 les:[
 {l:"Moelle (cordon antéro-latéral)",step:4,tx:"Perte thermo-algique controlatérale, quelques segments sous la lésion (après décussation). Brown-Séquard : thermo-algique controlatéral, lemniscal et moteur homolatéraux.",s:S_C},
 {l:"Centromédullaire (syringomyélie)",step:3,tx:"Dissociation thermo-algique « en cape » ou suspendue (douleur et température abolies, tact conservé) par atteinte de la décussation : brûlures non senties.",s:S_C},
 {l:"Tronc cérébral",step:6,tx:"Perte thermo-algique controlatérale de l'hémicorps (± de la face homolatérale dans le syndrome de Wallenberg, où le noyau spinal du V est touché).",s:S_CEN},
 {l:"Thalamus",step:8,tx:"Hémi-hypoesthésie thermo-algique controlatérale, éventuellement douleurs centrales thalamiques.",s:S_C}]}
];

/* ---------- LCS ---------- */
C.LCS={id:"lcs",nom:"Circulation du liquide cérébro-spinal",col:"#7fd8ff",cap:"De la production à la résorption",
 steps:[
 {p:[-1.7,2.7,1.2],t:"Plexus choroïdes (production)",d:"Environ 500 mL par jour, produits surtout dans les ventricules latéraux ; le LCS se renouvelle plusieurs fois par jour."},
 {p:[-1.2,2.3,4.0],via:1},
 {p:[-1.5,3.0,1.0],t:"Ventricule latéral",d:"Corne frontale, corps, atrium, corne occipitale et corne temporale."},
 {p:[-.9,1.9,.7],t:"Trou de Monro (foramen interventriculaire)",d:"Passage du ventricule latéral au 3e ventricule."},
 {p:[0,.4,.4],t:"3e ventricule",d:"Médian, entre les deux thalamus."},
 {p:[0,-1.3,-1.6],t:"Aqueduc du mésencéphale (de Sylvius)",d:"Canal étroit qui traverse le mésencéphale : point de blocage classique."},
 {p:[0,-3.4,-3.3],t:"4e ventricule",d:"En arrière du pont et du bulbe, en avant du cervelet."},
 {p:[0,-5.4,-4.5],t:"Orifices du 4e ventricule → grande citerne",d:"Trou de Magendie (médian) et trous de Luschka (latéraux) : le LCS passe dans l'espace sous-arachnoïdien."},
 {p:[-1.2,-6.6,-5.8],via:1},
 {p:[-3.2,-3,-8.6],t:"Espace sous-arachnoïdien",d:"Entre arachnoïde et pie-mère ; contient le LCS (une hémorragie méningée siège ici)."},
 {p:[-2,3.0,-7],via:1},
 {p:[-.5,5.4,-1.5],t:"Granulations arachnoïdiennes → sinus sagittal supérieur",d:"Résorption du LCS dans le sang veineux."}],
 les:[
 {l:"Trou de Monro",step:3,tx:"Dilatation d'un seul ventricule latéral (hydrocéphalie asymétrique).",s:S_CL},
 {l:"Aqueduc du mésencéphale",step:5,tx:"Hydrocéphalie non communicante (obstructive) : dilatation des ventricules latéraux et du 3e ventricule ; le 4e ventricule est normal.",s:S_CL},
 {l:"Sortie du 4e ventricule",step:7,tx:"Hydrocéphalie non communicante : tout le système ventriculaire est dilaté, y compris le 4e (par exemple tumeur de la fosse postérieure).",s:S_CL},
 {l:"Granulations (résorption)",step:11,tx:"Hydrocéphalie communicante : tous les ventricules sont dilatés, sans obstacle visible (après une hémorragie méningée ou une méningite).",s:S_CL}]};

/* ---------- voies visuelles ---------- */
C.VIS={
 steps:[
 {t:"Rétine",d:"Les fibres de la moitié nasale de chaque rétine croisent au chiasma ; la moitié temporale reste du même côté."},
 {t:"Nerf optique",d:"Avant le chiasma : chaque nerf transporte tout le champ visuel de son œil."},
 {t:"Chiasma optique",d:"Au-dessus de la selle turcique ; les fibres nasales croisent ici."},
 {t:"Bandelette optique",d:"Après le chiasma : chaque bandelette transporte un hémichamp visuel (le champ controlatéral)."},
 {t:"Corps genouillé latéral",d:"Relais thalamique de la voie visuelle."},
 {t:"Radiations optiques",d:"Elles contournent le ventricule latéral. Boucle de Meyer (temporal) : quadrant supérieur ; voie pariétale : quadrant inférieur."},
 {t:"Cortex visuel V1 (scissure calcarine)",d:"Lobe occipital, vascularisé par l'ACP."}],
 les:[
 {k:"nog",l:"Nerf optique gauche",tx:"Cécité monoculaire de l'œil gauche.",s:S_C},
 {k:"nod",l:"Nerf optique droit",tx:"Cécité monoculaire de l'œil droit.",s:S_C},
 {k:"chi",l:"Chiasma",tx:"Hémianopsie bitemporale (les fibres nasales croisées sont atteintes), classiquement par compression (adénome hypophysaire).",s:S_C},
 {k:"big",l:"Bandelette gauche",tx:"Hémianopsie latérale homonyme droite (après le chiasma).",s:S_C},
 {k:"bid",l:"Bandelette droite",tx:"Hémianopsie latérale homonyme gauche (après le chiasma).",s:S_C},
 {k:"rtg",l:"Radiations gauches (temporal)",tx:"Quadranopsie latérale homonyme supérieure droite (boucle de Meyer) ; atteinte pariétale : quadranopsie inférieure.",s:S_CL},
 {k:"v1g",l:"Cortex occipital gauche (ACP)",tx:"Hémianopsie latérale homonyme droite, souvent avec respect de la vision maculaire ; AVC dans le territoire de l'ACP gauche.",s:S_CEN}]
};

/* ---------- quiz clinique ---------- */
C.QZ=[
{q:"Déficit moteur à prédominance crurale controlatéral avec syndrome frontal (abulie).",o:["ACA","ACM superficielle","ACP","Tronc basilaire"],a:0,e:"ACA : face médiale, homonculus de la jambe ; syndrome frontal.",src:S_CEN,go:{mod:"vasc",id:"aca"}},
{q:"Hémiplégie brachio-faciale controlatérale avec aphasie.",o:["ACA","ACM superficielle gauche","ACP droite","PICA"],a:1,e:"ACM superficielle : bras et face ; aphasie si hémisphère dominant.",src:S_CEN,go:{mod:"vasc",id:"acm_sup"}},
{q:"Hémianopsie latérale homonyme isolée.",o:["ACA","ACM profonde","ACP","Artère ophtalmique"],a:2,e:"ACP : cortex occipital (ou tractus optique, radiations).",src:S_CEN,go:{mod:"vasc",id:"acp"}},
{q:"Cécité monoculaire brutale.",o:["Artère ophtalmique (carotide interne)","ACP","Tronc basilaire","ACM"],a:0,e:"La rétine est vascularisée par la carotide interne (artère ophtalmique) : cécité homolatérale.",src:S_CEN,go:{mod:"vasc",id:"ophth"}},
{q:"Vertige, Claude Bernard-Horner homolatéral, hypoesthésie thermo-algique de la face homolatérale et de l'hémicorps controlatéral, sans déficit moteur.",o:["ACM","PICA (Wallenberg)","ACA","Artère choroïdienne antérieure"],a:1,e:"Syndrome de Wallenberg : infarctus bulbaire latéral, PICA ou vertébrale.",src:S_CEN,go:{mod:"vasc",id:"pica"}},
{q:"Coma, atteinte motrice bilatérale, locked-in syndrome.",o:["ACA bilatérale","Carotide interne","Tronc basilaire","ACP unilatérale"],a:2,e:"AVC grave du tronc cérébral : occlusion du tronc basilaire.",src:S_CEN,go:{mod:"vasc",id:"bas"}},
{q:"Hémiplégie controlatérale proportionnelle (face, bras, jambe) sans aphasie ni négligence.",o:["Capsule interne (lenticulo-striées)","ACM superficielle","ACP","Moelle cervicale"],a:0,e:"Fibres très groupées dans la capsule : atteinte lacunaire, cortex épargné.",src:S_C,go:{mod:"vasc",id:"lent"}},
{q:"Hémianopsie bitemporale.",o:["Nerf optique","Chiasma","Bandelette optique","Cortex occipital"],a:1,e:"Les fibres nasales croisées sont atteintes au chiasma.",src:S_C,go:{mod:"voies",path:"vis",les:"chi"}},
{q:"Hémiplégie controlatérale respectant la face.",o:["Capsule interne","Pyramide bulbaire","Cortex frontal","Pied du pédoncule"],a:1,e:"Au niveau bulbaire, le faisceau cortico-nucléaire est déjà parti : la face est épargnée.",src:S_CL,go:{mod:"voies",path:"motrice",les:3}},
{q:"Hémiplégie controlatérale + paralysie du III homolatérale.",o:["Wallenberg","Syndrome de Weber (pédoncule)","Brown-Séquard","Syndrome de Millard-Gubler"],a:1,e:"Syndrome alterne : lésion du pied du pédoncule cérébral (mésencéphale).",src:S_CL,go:{mod:"voies",path:"motrice",les:2}},
{q:"Dissociation thermo-algique « en cape », tact conservé.",o:["Cordons postérieurs","Syringomyélie (centromédullaire)","Queue de cheval","Capsule interne"],a:1,e:"Atteinte de la décussation spino-thalamique au centre de la moelle.",src:S_C,go:{mod:"voies",path:"spino",les:1}},
{q:"Où décusse la voie lemniscale ?",o:["Dans la moelle","Dans le bulbe","Dans le pont","Dans le thalamus"],a:1,e:"Lemniscale : bulbe (haut). Spino-thalamique : moelle (sur place).",src:S_C,go:{mod:"voies",path:"lemn"}},
{q:"Ventricules latéraux et 3e ventricule dilatés, 4e ventricule normal.",o:["Obstruction de l'aqueduc","Obstruction des granulations arachnoïdiennes","Obstruction du trou de Monro (unilatéral)","Tumeur de la fosse postérieure"],a:0,e:"Hydrocéphalie non communicante par sténose de l'aqueduc.",src:S_CL,go:{mod:"lcs",les:1}}
];
})();
