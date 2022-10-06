import { useRef, useMemo, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei' 

export default function MyHtml(props) { 
  const group = useRef()

  // Make it float
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, Math.cos(t / 2) / 20, 0.1)
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t / 4) / 20, 0.1)
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, Math.sin(t / 8) / 20, 0.1)
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, (-2 + Math.sin(t / 2)) / 2, 0.1)
  })

  return (
    <group ref={group} {...props} dispose={null}  position={[0, 5, -10]}>
      <mesh>
        <Html transform scale={1} rotation={[0, 0, 0]} position={[-15, 0, 0]}>
            <div className="card border-light mb-3" style={{width: '500px'}}>
                <div className="card-body">
                    <h3>Creative Developer</h3>
                    <p className="card-text"><strong>Mobile, Desktop & Web, Cross-platform code, Fast Websites & Futur apps</strong></p>
                    <p className="card-text">Je suis Julien Guézennec, un webmaster et architecte logiciel français, avec le pseudo de "Molokoloco".<br/>
                    J'ai créé mon premier site Web en 1998 (Pour Alcatel Lannion) et je suis tombé amoureux du développement et du multimédia. Depuis, je n'ai jamais cessé d'apprendre des choses. Je suis spécialisé dans le développement front-end et back-end de sites mobiles et web.<br/>
                    J'aime concevoir et développer des interfaces utilisateur. Je me soucie de l'UX, de la réactivité, de la performance, de la maintenabilité et de l'évolutivité.</p>
                    <p>Freelance web • Conception Internet • Consultant • Formation • E-commerce • Réseaux sociaux</p>
                    <p className="text-center"><button id="btnCabinet" type="button" className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#cabinet">Entrer en contact</button></p>
                  </div>
              </div>
        </Html>
      </mesh>
      <mesh>
        <Html transform scale={1} rotation={[0, 0, 0]} position={[5, 0, 0]}>
          <div className="col-lg-6 mb-4 ms-auto">
                  <div className="card border-light mb-3" style={{width: '500px'}}>
                      <div className="card-body">
                          <h3>Craft Code & Design</h3>
                          <p><a href="https://web.archive.org/web/20160311233601/http://www.b2bweb.fr/molokoloco/etienne-chouard-centralite-du-tirage-au-sort-en-democratie/" title="My Book ReadR V2 – HTML5 / jQuery polished “Page as a Book” reader">MyBookReadR V2</a> • <a href="https://web.archive.org/web/20160311233601/http://www.b2bweb.fr/molokoloco/jquery-colonize-plugin-in-between-titles-multicols-paragraphes-with-css3/" title="jQuery Colonize plugin : In-between titles multicols paragraphs with CSS3">jQuery.colonize</a> • <a href="https://web.archive.org/web/20160311233601/http://www.b2bweb.fr/molokoloco/dynamisez-vos-pages-web-avec-jquery-boxfx-js/" title="Dynamisez vos pages web avec jQuery.boxFx.js">jQuery.boxFx</a> • <a href="https://web.archive.org/web/20160311233601/http://www.b2bweb.fr/molokoloco/mutli-screen-flat-3d-analogue-clock-with-jquery-and-css3-v2-3/" title="Multi-screen “Flat 3D” analogue clock (jQuery/CSS3)">jQuery.flatClock3d</a> • <a href="https://web.archive.org/web/20160311233601/http://www.b2bweb.fr/wall/" title="Try the speed Wall !" target="_blank">The RSS Wall</a> • <a href="https://web.archive.org/web/20160311233601/http://home.b2bweb.fr/" title="GoogleBot is Fast Web Start • CodeBot is Fast Coding Tools • TwitterBot is full access to twitter" target="_blank">FastWebStart</a> • <a href="https://web.archive.org/web/20160311233601/http://www.braincer.fr/" title="Braincer is a 3D music visualizer : ♫ Playing ♫" target="_blank">Braincer.fr</a><br/>
                          My latest sources and sheets :<br/>
                          <a href="https://web.archive.org/web/20160311233601/https://github.com/molokoloco/" target="_blank" title="Molokoloco Github sources repository">Github sources</a> • <a href="https://web.archive.org/web/20160311233601/http://code.google.com/p/molokoloco-coding-project/w/list" target="_blank" title="Molokoloco coding project on Google Code">Personnal wikis</a> • <a href="https://web.archive.org/web/20160311233601/http://jsfiddle.net/user/molokoloco/" target="_blank" title="Fiddles posted by Molokoloco">jsFiddle examples</a> • <a href="https://web.archive.org/web/20160311233601/http://www.b2bweb.fr/molokoloco/best-must-know-ressources-for-building-the-new-web-%E2%98%85/" title="Best “must know” open sources to build the new Web">WebDev bookmarks</a></p>
                      </div>
                  </div>
                  <br/>
                  <div className="card border-light mb-3" style={{width: '500px'}}>
                      <div className="card-body">
                          <h3>Follow Me</h3>
                            <ul>
                                <li>
                                    <svg viewBox="0 0 24 24" width="36" height="36" fill="hsl(219.1, 100%, 99%)">
                                        <path d="m2.001 9.352c0 1.873.849 2.943 1.683 3.943.031 1 .085 1.668-.333 3.183 1.748-.558 2.038-.778 3.008-1.374 1
                                        .244 1.474.381 2.611.491-.094.708-.081 1.275.055 2.023-.752-.06-1.528-.178-2.33-.374-1.397.857-4.481
                                        1.725-6.649 2.115.811-1.595 1.708-3.785 1.661-5.312-1.09-1.305-1.705-2.984-1.705-4.695-.001-4.826 4.718-8.352
                                        9.999-8.352 5.237 0 9.977 3.484 9.998
                                        8.318-.644-.175-1.322-.277-2.021-.314-.229-3.34-3.713-6.004-7.977-6.004-4.411 0-8 2.85-8 6.352zm20.883
                                        10.169c-.029 1.001.558 2.435 1.088 3.479-1.419-.258-3.438-.824-4.352-1.385-.772.188-1.514.274-2.213.274-3.865
                                        0-6.498-2.643-6.498-5.442 0-3.174 3.11-5.467 6.546-5.467 3.457 0 6.546 2.309 6.546 5.467 0 1.12-.403
                                        2.221-1.117 3.074zm-7.563-3.021c0-.453-.368-.82-.82-.82s-.82.367-.82.82.368.82.82.82.82-.367.82-.82zm3
                                        0c0-.453-.368-.82-.82-.82s-.82.367-.82.82.368.82.82.82.82-.367.82-.82zm3
                                        0c0-.453-.368-.82-.82-.82s-.82.367-.82.82.368.82.82.82.82-.367.82-.82z">
                                        </path>
                                    </svg>
                                    <span>SMS : <a href="sms:+33678135439">+33 6 61 75 64 98</a></span>
                                </li>
                                <li >
                                    <svg viewBox="0 0 24 24" width="36" height="36" fill="hsl(219.1, 100%, 99%)">
                                        <path d="m12 12.713-11.985-9.713h23.971zm-5.425-1.822-6.575-5.329v12.501zm10.85 0 6.575 7.172v-12.501zm-1.557
                                        1.261-3.868 3.135-3.868-3.135-8.11 8.848h23.956z">
                                        </path>
                                    </svg>
                                    <span>Mail : <a href="mailto:julien.guezennec@gmail.com">julien.guezennec@gmail.com</a></span>
                                </li>
                                <li >
                                    <svg viewBox="0 0 24 24" width="36" height="36" fill="hsl(219.1, 100%, 99%)">
                                        <path d="m20 22.621-3.521-6.795c-.008.004-1.974.97-2.064 1.011-2.24
                                        1.086-6.799-7.82-4.609-8.994l2.083-1.026-3.493-6.817-2.106 1.039c-7.202 3.755 4.233 25.982 11.6
                                        22.615.121-.055 2.102-1.029 2.11-1.033z">
                                        </path>
                                    </svg>
                                    <span>Appel :  <a href="tel:+33678135439">+33 6 61 75 64 98</a></span>
                                </li>
                                <li >
                                    <svg viewBox="0 0 30 25" width="36" height="36" fill="hsl(219.1, 100%, 99%)">
                                        <path d="m30 2.88565824c-1.1041883.49036576-2.2902965.82035307-3.5352486.9691935 1.2714895-.76150918
                                        2.246452-1.96723203 2.7056651-3.40486905-1.1884158.70497289-2.5060574 1.21726088-3.9090804
                                        1.4941733-1.1226491-1.19649244-2.7218184-1.94415599-4.4917503-1.94415599-3.3991 0-6.1543787
                                        2.75643244-6.1543787 6.15437868 0 .48228914.0553825.95304027.1592247
                                        1.40186916-5.11480332-.256144-9.64924431-2.70681897-12.68605058-6.43129111-.52844122.9091958-.83189109
                                        1.96607823-.83189109 3.09565017 0 2.13453329 1.08572748 4.01869159 2.73681782
                                        5.12172609-1.00842275-.03230645-1.95800162-.30921888-2.78758509-.76958579v.07730472c0 2.98257758 2.12068766
                                        5.47017418 4.9371178 6.03438328-.51574939.1407638-1.06034383.2157609-1.6222453.2157609-.39575401
                                        0-.7822776-.0392292-1.15726318-.1096111.78343141 2.4449059 3.05642091 4.2252221 5.74939425
                                        4.2748356-2.10568824 1.6510903-4.75943233 2.6352832-7.64393677 2.6352832-.49613476
                                        0-.98650052-.028845-1.46878966-.0865351 2.724126 1.7457021 5.95823238 2.764509 9.43463713 2.764509 11.32110307
                                        0 17.51009577-9.3781008 17.51009577-17.51124952 0-.26652821-.005769-.53190262-.017307-.79612323
                                        1.2034152-.86881274 2.2476058-1.95223261 3.0725741-3.18564671z">
                                        </path>
                                    </svg>
                                    <span>Message : <a href="https://twitter.com/molokoloco">@molokoloco</a> on Twitter</span>
                                </li>
                                <li >
                                    <svg viewBox="0 0 30 30" width="36" height="36" fill="hsl(219.1, 100%, 99%)">
                                        <path d="m27.2727273 0h-24.54545457c-1.50681818 0-2.72727273 1.22045455-2.72727273 2.72727273v24.54545457c0
                                        1.5068182 1.22045455 2.7272727 2.72727273 2.7272727h24.54545457c1.5068182 0 2.7272727-1.2204545
                                        2.7272727-2.7272727v-24.54545457c0-1.50681818-1.2204545-2.72727273-2.7272727-2.72727273zm-17.79000003
                                        24.5454545h-4.02272727v-12.9436363h4.02272727zm-2.05227272-14.79409086c-1.29681819
                                        0-2.34545455-1.05136364-2.34545455-2.34545455s1.05-2.34409091 2.34545455-2.34409091c1.29272727 0 2.3440909
                                        1.05136364 2.3440909 2.34409091 0 1.29409091-1.05136363 2.34545455-2.3440909 2.34545455zm17.12045455
                                        14.79409086h-4.02v-6.2945454c0-1.5013636-.0272727-3.4322727-2.0904546-3.4322727-2.0931818 0-2.415 1.635-2.415
                                        3.3231818v6.4036363h-4.02v-12.9436363h3.859091v1.7686363h.0545454c.5372727-1.0172727 1.8490909-2.0904545
                                        3.8059091-2.0904545 4.0731818 0 4.8259091 2.6809091 4.8259091 6.1663636z">
                                        </path>
                                    </svg>
                                    <span>Réseau : <a href="https://www.linkedin.com/in/julien-guezennec/">@julien-guezennec</a> on LinkedIn</span>
                                </li>
                                <li>
                                    <svg viewBox="0 0 30 30" width="36" height="36" fill="hsl(219.1, 100%, 99%)">
                                        <path d="m12.9325926 1.9057037c-6.08014816 0-11.0268889 4.94674074-11.0268889 11.0268889 0 3.2673333 1.43577778
                                        6.1976296 3.69970371
                                        8.2179259.07029629-.0491111.156-.0914815.25711111-.1251852.08955555-.026.17814815-.0529629.26385185-.0789629
                                        2.52103704-.7732593 3.12385185-1.4425185
                                        3.35111111-2.1811111.41792593-.1868149.57392592-.3148889.65674072-.7588149.052-.2821481.0924445-1.2287407.052963-1.5571111-.23881483-.233037-.36881483-.8329629-.48437039-1.0727407-.2677037-.5546667-.31488888-.8416296-.572-1.7747407-.03948148-.1251852-.12422222-.1328889-.18392592-.156963-.08955556-.0375556-.16755556-.0972593-.25037037-.2099259-.234-.3168149-.08762963-.495926-.30718519-1.0977778-.27925926-.6846667-.39192592-1.3606667-.17911111-1.5628889.14348148-.1280741.23977778-.0452593.31007408-.0192593.04622222.0173334.01059259-.0991851-.03081482-.2677037-.16851852-.68948145-.17814815-2.06459256-.17814815-2.06459256l.026-.00096296c-.08666666-.57488889-.06644444-1.10451852.31488889-1.90762963.37555556-.82044445.71162963-.63940741.90037037-.8502963.79637041-.89651852
                                        1.52822221-.91962963 2.07807411-1.15651852 1.2354814-.53348148 2.2774074-.06066666
                                        3.1103703.28792593.3505186.15118518 1.3722223.2677037 1.7131111 1.0217037.1993334.43911111.3736297
                                        1.18925926.4410371 1.25666667.0712592.32355556.1097778.84548148.0731852 1.41748148-.0452593.70681482-.0462223
                                        1.29133333-.2137778
                                        1.98081479-.0423704.1675556-.078963.2850371-.0317778.2667408.0702963-.026.1579259-.1213334.3014074.0067407.2118519.2022222.1685185.9071111-.1107407
                                        1.5917778-.2185926.6018518-.0982222.7125926-.2378519.9591111-.0597037.1078518-.1011111.2532593-.2821481.3187407-.0597037.0221482-.1328889.0751111-.1608148.2041482-.1945186.9071111-.2436297
                                        1.0727407-.4477778 1.7535555-.0760741.2542223-.2503704.8021482-.4805185 1.0178519-.0481482.39.0654815
                                        1.3905185.1309629 1.6158518.1521482.5277037.2975556.6307408.5941482.7588149.3649629.7626666.6461481 1.7574074
                                        3.4445185
                                        2.2022963.1271111.0202222.259037.0394814.3967407.0577777.1588889.0231111.286963.0654815.4005926.1155556
                                        2.2571852-2.0212593 3.6891111-4.9467408 3.6891111-8.2082963
                                        0-6.08014816-4.9477037-11.0268889-11.0278518-11.0268889m0 23.9594815c-7.1422963
                                        0-12.9325926-5.7893333-12.9325926-12.9325926 0-7.1422963 5.7902963-12.9325926 12.9325926-12.9325926s12.9335555
                                        5.7902963 12.9335555 12.9325926c0 7.1432593-5.7912592 12.9325926-12.9335555 12.9325926" fillRule="evenodd" transform="translate(2 2)"></path>
                                    </svg>
                                    <span>Carte de contact : <a href="%PUBLIC_URL%/contacts-Julien-Guézennec.vcf">Contacts.VCF</a></span>
                                </li>
                            </ul>
                      </div>
                  </div> 
              </div>
          </Html>
        </mesh>
    </group>
  )
}