'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Labo son ────────────────────────────────────────────────────────────────
// Page de travail interne, volontairement hors index. Elle sert a deux choses,
// et il faut la voir depuis un telephone reel :
//
//  1. Ecouter les six sons d'interface fabriques pour le site d'apprentissage,
//     et dire lesquels gardent leur place.
//  2. Repondre a la question qui bloquait tout : est-ce qu'une recitation
//     hebergee ailleurs est joignable depuis un vrai navigateur ?
//     Cette question ne peut PAS se trancher depuis le serveur : la sortie
//     reseau de l'atelier est filtree, celle du telephone ne l'est pas. C'est
//     ce navigateur-ci qui a la reponse, pas moi.
//
// La sonde n'utilise pas fetch : la plupart de ces hebergeurs n'envoient pas
// d'en-tete CORS, un fetch echouerait meme quand le fichier est parfaitement
// lisible. Un element <audio> n'est pas soumis a cette regle pour la simple
// lecture : on ecoute donc « canplay » plutot que de lire une reponse HTTP.

interface Source {
  cle: string;
  nom: string;
  detail: string;
  url: string;
  portee: 'verset' | 'sourate';
}

const SOURCES: Source[] = [
  {
    cle: 'islamic-network-verset',
    nom: 'Islamic Network',
    detail: 'Alafasy — verset par verset (cdn.islamic.network)',
    url: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
    portee: 'verset',
  },
  {
    cle: 'everyayah',
    nom: 'EveryAyah',
    detail: 'Alafasy 128k — verset par verset (everyayah.com)',
    url: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3',
    portee: 'verset',
  },
  {
    cle: 'quran-com',
    nom: 'Quran.com',
    detail: 'Alafasy — verset par verset (verses.quran.com)',
    url: 'https://verses.quran.com/Alafasy/mp3/001001.mp3',
    portee: 'verset',
  },
  {
    cle: 'everyayah-husary',
    nom: 'EveryAyah — Husary',
    detail: 'Husary lent, la voix des ecoles (everyayah.com)',
    url: 'https://everyayah.com/data/Husary_128kbps_Mujawwad/001001.mp3',
    portee: 'verset',
  },
  {
    cle: 'islamic-network-sourate',
    nom: 'Islamic Network — sourate',
    detail: 'Al-Fatiha entiere (cdn.islamic.network)',
    url: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3',
    portee: 'sourate',
  },
  {
    cle: 'mp3quran',
    nom: 'MP3Quran',
    detail: 'Al-Fatiha entiere (server8.mp3quran.net)',
    url: 'https://server8.mp3quran.net/afs/001.mp3',
    portee: 'sourate',
  },
  {
    cle: 'quranicaudio',
    nom: 'QuranicAudio',
    detail: 'Al-Fatiha entiere (download.quranicaudio.com)',
    url: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3',
    portee: 'sourate',
  },
];

const SONS = [
  { fichier: 'bon', nom: 'Bonne reponse', role: 'Deux cloches qui montent. Court, net.' },
  { fichier: 'presque', nom: 'Reponse ratee', role: 'Grave et chaud. Il ne punit pas : c’est le son le plus important.' },
  { fichier: 'tap', nom: 'Carte suivante', role: 'Un tic presque invisible. On l’entend 14 fois par lecon.' },
  { fichier: 'serie', nom: 'Ta serie augmente', role: 'La recompense du jour. Celui qu’on doit avoir envie de reentendre demain.' },
  { fichier: 'fin', nom: 'Lecon terminee', role: 'Une figure qui se pose. Elle sonne « fini », pas « en attente ».' },
  { fichier: 'objectif', nom: 'Objectif du jour atteint', role: 'La plus pleine des six, et pourtant sobre.' },
];

type Etat = 'attente' | 'test' | 'ok' | 'ko';

export default function LaboClient() {
  const [etats, setEtats] = useState<Record<string, Etat>>({});
  const [delais, setDelais] = useState<Record<string, number>>({});
  const [lance, setLance] = useState(false);
  const lecteur = useRef<HTMLAudioElement | null>(null);

  const tester = useCallback((s: Source) => {
    return new Promise<void>((resolve) => {
      const depart = Date.now();
      const audio = new Audio();
      audio.preload = 'auto';
      let fini = false;

      const conclure = (etat: Etat) => {
        if (fini) return;
        fini = true;
        setEtats((e) => ({ ...e, [s.cle]: etat }));
        setDelais((d) => ({ ...d, [s.cle]: Date.now() - depart }));
        audio.src = '';
        resolve();
      };

      // « canplay » suffit : le navigateur a recu assez d'octets pour lire.
      audio.addEventListener('canplay', () => conclure('ok'), { once: true });
      audio.addEventListener('loadedmetadata', () => conclure('ok'), { once: true });
      audio.addEventListener('error', () => conclure('ko'), { once: true });
      // Un hebergeur injoignable ne repond parfois jamais : on tranche a 12 s.
      setTimeout(() => conclure('ko'), 12000);

      audio.src = s.url;
      audio.load();
    });
  }, []);

  const testerTout = useCallback(async () => {
    setLance(true);
    setEtats(Object.fromEntries(SOURCES.map((s) => [s.cle, 'test' as Etat])));
    await Promise.all(SOURCES.map(tester));
  }, [tester]);

  // On lance la sonde des l'ouverture : Mohamed n'a rien a faire.
  useEffect(() => {
    const t = setTimeout(testerTout, 400);
    return () => clearTimeout(t);
  }, [testerTout]);

  const jouer = (url: string) => {
    if (lecteur.current) {
      lecteur.current.pause();
    }
    const a = new Audio(url);
    lecteur.current = a;
    a.play().catch(() => {
      /* refus du navigateur : le bouton reste, rien ne casse */
    });
  };

  const reussies = SOURCES.filter((s) => etats[s.cle] === 'ok');
  const testees = SOURCES.filter((s) => etats[s.cle] === 'ok' || etats[s.cle] === 'ko');

  return (
    <div className="labo">
      <header className="labo-tete">
        <p className="labo-sur">Page de travail — non referencee</p>
        <h1>Labo son</h1>
        <p className="labo-intro">
          Deux choses a juger, et il faut le faire depuis ton telephone, avec le
          son allume. En bas, la question qui bloquait tout.
        </p>
      </header>

      <section className="labo-bloc">
        <h2>1. Les six sons du site d&rsquo;apprentissage</h2>
        <p className="labo-note">
          Fabriques ici, de zero. Aucune licence, aucun ayant droit. Ce sont des
          timbres de cloche, pas de la musique : sur un site religieux, un son
          court n&rsquo;ouvre pas le debat des instruments. Appuie sur chacun.
        </p>
        <div className="labo-sons">
          {SONS.map((s) => (
            <button
              key={s.fichier}
              type="button"
              className="labo-son"
              onClick={() => jouer(`/sons/${s.fichier}.mp3`)}
            >
              <span className="labo-son-icone" aria-hidden="true">
                &#9654;
              </span>
              <span className="labo-son-texte">
                <strong>{s.nom}</strong>
                <span>{s.role}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="labo-bloc">
        <h2>2. La recitation est-elle joignable&nbsp;?</h2>
        <p className="labo-note">
          Depuis l&rsquo;atelier, ces adresses sont bloquees — mais l&rsquo;atelier
          n&rsquo;est pas ton telephone. C&rsquo;est <strong>ce navigateur</strong> qui
          a la reponse. La sonde tourne toute seule&nbsp;; chaque ligne verte est
          une source utilisable, et tu peux l&rsquo;ecouter tout de suite.
        </p>

        <div className="labo-resume">
          {!lance && <span>Sonde en cours de demarrage…</span>}
          {lance && testees.length < SOURCES.length && (
            <span>
              Test en cours… {testees.length} / {SOURCES.length}
            </span>
          )}
          {lance && testees.length === SOURCES.length && (
            <span className={reussies.length ? 'ok' : 'ko'}>
              {reussies.length
                ? `${reussies.length} source${reussies.length > 1 ? 's' : ''} sur ${SOURCES.length} repond${reussies.length > 1 ? 'ent' : ''}.`
                : 'Aucune source ne repond depuis ce reseau.'}
            </span>
          )}
        </div>

        <ul className="labo-sources">
          {SOURCES.map((s) => {
            const etat = etats[s.cle] ?? 'attente';
            return (
              <li key={s.cle} className={`labo-source ${etat}`}>
                <span className="labo-pastille" aria-hidden="true">
                  {etat === 'ok' ? '✓' : etat === 'ko' ? '✕' : '·'}
                </span>
                <span className="labo-source-texte">
                  <strong>{s.nom}</strong>
                  <span className="labo-source-detail">{s.detail}</span>
                  <span className="labo-source-etat">
                    {etat === 'test' && 'test en cours…'}
                    {etat === 'ok' && `repond en ${(delais[s.cle] / 1000).toFixed(1)} s`}
                    {etat === 'ko' && 'ne repond pas'}
                    {etat === 'attente' && 'en attente'}
                  </span>
                </span>
                {etat === 'ok' && (
                  <button type="button" className="labo-ecouter" onClick={() => jouer(s.url)}>
                    Ecouter
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <p className="labo-pied">
          Les recitations appartiennent a leurs recitateurs. Si une source est
          retenue, le site la lira <strong>sans jamais l&rsquo;heberger</strong>, en
          nommant le recitateur et la source sur la page. Et jamais de voix de
          synthese sur le Coran&nbsp;: ce sont de vrais recitateurs, ou rien.
        </p>
      </section>
    </div>
  );
}
