"use client";

import { useState } from "react";
import { EMAIL, PHONE_TEL } from "@/lib/content";

const WANTS = ["Új weboldalt szeretnék.", "A meglévő oldalamat szeretném megújítani.", "Még nem tudom pontosan, beszéljük meg."];

/** A message you finish like a sentence; it opens in the visitor's own mail or SMS app. */
export function Composer() {
  const [name, setName] = useState("");
  const [biz, setBiz] = useState("");
  const [want, setWant] = useState(0);
  const [reach, setReach] = useState("");

  const text =
    `Szia! ${name.trim() || "…"} vagyok, a vállalkozásom: ${biz.trim() || "…"}. ` +
    `${WANTS[want]}` +
    (reach.trim() ? ` Itt érsz el: ${reach.trim()}.` : "");
  const mail = `mailto:${EMAIL}?subject=${encodeURIComponent("Weboldal")}&body=${encodeURIComponent(text)}`;
  const sms = `sms:${PHONE_TEL}?&body=${encodeURIComponent(text)}`;

  return (
    <div className="l-composer" data-l-in="">
      <p className="l-sentence">
        Szia!{" "}
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="a neved" aria-label="A neved" autoComplete="name" size={10} />{" "}
        vagyok, a vállalkozásom:{" "}
        <input value={biz} onChange={(e) => setBiz(e.target.value)} placeholder="mivel foglalkozol" aria-label="Mivel foglalkozik a vállalkozásod" size={16} />.
      </p>
      <div className="l-wants" role="radiogroup" aria-label="Mit szeretnél">
        {WANTS.map((wt, i) => (
          <button key={wt} type="button" role="radio" aria-checked={want === i} onClick={() => setWant(i)}>
            {wt}
          </button>
        ))}
      </div>
      <p className="l-sentence">
        Itt érsz el:{" "}
        <input value={reach} onChange={(e) => setReach(e.target.value)} placeholder="telefon vagy e-mail" aria-label="Telefonszámod vagy e-mail-címed" size={18} />
      </p>
      <div className="l-send">
        <a className="l-btn l-btn--solid" href={mail} data-track="urlap_kuldes" data-l-magnet="">
          Elküldöm e-mailben
        </a>
        <a className="l-btn" href={sms} data-track="sms">
          Inkább SMS-ben
        </a>
      </div>
      <p className="l-note">A kész szöveg a saját leveleződben vagy üzenetküldődben nyílik meg; ez az oldal semmit sem tárol.</p>
    </div>
  );
}
