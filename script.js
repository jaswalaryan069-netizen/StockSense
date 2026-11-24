
/* ================= storage ================= */

const DB_KEY='stocksense_db_v2';

function load(){
  try{
    return JSON.parse(localStorage.getItem(DB_KEY));
  }catch(e){
    return null;
  }
}

function save(){
  try{
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }catch(e){}
}

const today=()=>new Date().toISOString().slice(0,10);


/* ================= database seed ================= */

function seed(){

  return {

    users:[
      {
        name:'Demo Manager',
        loginId:'demo',
        email:'demo@stocksense.io',
        pass:'demo1234',
        role:'Inventory Manager'
      }
    ],

    session:null,
    otp:null,

    warehouses:[
      {
        id:1,
        name:'Main Warehouse',
        code:'WH',
        address:'12 Dock Road'
      },
      {
        id:2,
        name:'North Depot',
        code:'ND',
        address:'44 Harbor Lane'
      }
    ],

    locations:[
      {
        id:1,
        name:'Stock Room 1',
        code:'Stock1',
        warehouseId:1
      },
      {
        id:2,
        name:'Stock Room 2',
        code:'Stock2',
        warehouseId:1
      },
      {
        id:3,
        name:'Loading Bay',
        code:'Stock3',
        warehouseId:2
      }
    ],

    categories:[
      'Raw Material',
      'Finished Goods',
      'Components'
    ],

    products:[
      {
        id:1,
        name:'Desk',
        sku:'DESK001',
        category:'Finished Goods',
        uom:'unit',
        reorder:10,
        cost:3000,
        stock:{
          Stock1:50,
          Stock2:0,
          Stock3:0
        }
      },

      {
        id:2,
        name:'Table',
        sku:'TBL014',
        category:'Finished Goods',
        uom:'unit',
        reorder:10,
        cost:3000,
        stock:{
          Stock1:50,
          Stock2:0,
          Stock3:0
        }
      },

      {
        id:3,
        name:'Bolt Set (M8)',
        sku:'BLT008',
        category:'Components',
        uom:'box',
        reorder:10,
        cost:80,
        stock:{
          Stock1:4,
          Stock2:0,
          Stock3:0
        }
      },

      {
        id:4,
        name:'Steel Sheet',
        sku:'STL045',
        category:'Raw Material',
        uom:'kg',
        reorder:100,
        cost:65,
        stock:{
          Stock1:220,
          Stock2:0,
          Stock3:40
        }
      },

      {
        id:5,
        name:'Plastic Chair',
        sku:'CHR020',
        category:'Finished Goods',
        uom:'unit',
        reorder:15,
        cost:850,
        stock:{
          Stock1:0,
          Stock2:6,
          Stock3:0
        }
      },

      {
        id:6,
        name:'Hinge Set',
        sku:'HNG003',
        category:'Components',
        uom:'box',
        reorder:20,
        cost:45,
        stock:{
          Stock1:0,
          Stock2:0,
          Stock3:0
        }
      }
    ],

    nextProductId:7,
    nextWhId:3,
    nextLocId:4,
    nextDocId:1,

    receipts:[],
    deliveries:[],
    adjustments:[],
    ledger:[]
  };
}

let db = load() || seed();

if(!load()) save();


/* ================= authentication ================= */

function showScreen(s){

  [
    'loginForm',
    'signupForm',
    'reset1Form',
    'reset2Form'
  ].forEach(
    f=>document.getElementById(f).style.display='none'
  );

  [
    'loginErr',
    'signupErr',
    'reset1Err',
    'reset2Err'
  ].forEach(
    id=>document.getElementById(id).textContent=''
  );

  const map={
    login:[
      'loginForm',
      'Sign in to your inventory dashboard'
    ],

    signup:[
      'signupForm',
      'Create your StockSense account'
    ],

    reset1:[
      'reset1Form',
      'Reset your password'
    ],

    reset2:[
      'reset2Form',
      'Reset your password'
    ]
  };

  document.getElementById(map[s][0]).style.display='block';

  document.getElementById('authTag').textContent=map[s][1];
}


/* ================= guided tour ================= */

const tourSlides=[
  {
    h:'Why StockSense?',
    b:`Small teams often run inventory on scattered spreadsheets — nobody is sure
       what's really on the shelf, what's already promised to a customer, or
       what's about to run out. StockSense gives everyone one shared, live view
       of stock instead.`,
    l:null
  },
  {
    h:'The core idea: Warehouse → Location → Product',
    b:`Stock always lives in a Warehouse (a building/site), inside a Location
       (a room, rack or bay). Every Product tracks how many units sit in each
       Location, so you always know exactly where things are.`,
    l:null
  },
  {
    h:'Four things you\'ll do most',
    b:null,
    l:[
      '📥 <b>Receipts</b> — stock coming IN from a supplier',
      '📤 <b>Delivery</b> — stock going OUT to a customer',
      '🔁 <b>Adjustments</b> — moving/correcting stock between locations',
      '📊 <b>Dashboard &amp; Stock</b> — live totals and low/out-of-stock alerts'
    ]
  },
  {
    h:'A typical first-day flow',
    b:null,
    l:[
      '1. Add your Warehouses and Locations (Settings)',
      '2. Add your Products with a reorder point (Products)',
      '3. Log a Receipt to bring in opening stock',
      '4. Create Deliveries as orders come in',
      '5. Watch the Dashboard for anything running low'
    ]
  },
  {
    h:'Whenever you\'re stuck',
    b:`Open the <b>📘 Guide</b> tab any time for a full walkthrough of every
       screen, or tap the <b>?</b> button in the bottom-right corner for a
       quick tip about the page you're on.`,
    l:null
  }
];

let tourStep=0;

function openTour(fromLanding){

  tourStep=0;

  document.getElementById('modalBody').innerHTML=renderTourStep();

  openModal();

  if(fromLanding) localStorage.setItem('stocksense_intro_seen','1');
}

function renderTourStep(){

  const s=tourSlides[tourStep];

  return `

    <h3>Getting started</h3>

    <div class="tour-steps">
      ${tourSlides.map((_,i)=>`<span class="${i<=tourStep?'on':''}"></span>`).join('')}
    </div>

    <div class="tour-body">
      <h4>${s.h}</h4>
      ${s.b?`<p>${s.b}</p>`:''}
      ${s.l?`<ul>${s.l.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}
    </div>

    <div class="modal-actions">
      ${tourStep>0?`<button class="btn-sm ghost" onclick="tourNav(-1)">Back</button>`:`<button class="btn-sm ghost" onclick="closeModal()">Skip</button>`}
      ${tourStep<tourSlides.length-1
        ?`<button class="btn-sm" onclick="tourNav(1)">Next</button>`
        :`<button class="btn-sm" onclick="closeModal()">Got it, let's go</button>`}
    </div>

  `;
}

function tourNav(dir){
  tourStep+=dir;
  document.getElementById('modalBody').innerHTML=renderTourStep();
}


function doSignup(){

  const loginId=document
    .getElementById('su-id')
    .value
    .trim();

  const email=document
    .getElementById('su-email')
    .value
    .trim();

  const role=document
    .getElementById('su-role')
    .value;

  const pass=document.getElementById('su-pass').value;

  const pass2=document.getElementById('su-pass2').value;

  if(!loginId||!email||!pass){
    document.getElementById('signupErr').textContent=
      'Fill in every field.';
    return;
  }

  if(pass!==pass2){
    document.getElementById('signupErr').textContent=
      'Passwords do not match.';
    return;
  }

  if(db.users.some(u=>u.loginId===loginId)){
    document.getElementById('signupErr').textContent=
      'That Login Id is taken.';
    return;
  }

  db.users.push({
    name:loginId,
    loginId,
    email,
    pass,
    role
  });

  db.session=loginId;

  save();

  enterApp();
}


function doLogin(){

  const loginId=document
    .getElementById('li-id')
    .value
    .trim();

  const pass=document
    .getElementById('li-pass')
    .value;

  const u=db.users.find(
    u=>u.loginId===loginId && u.pass===pass
  );

  if(!u){
    document.getElementById('loginErr').textContent=
      'Incorrect Login Id or password.';
    return;
  }

  db.session=loginId;

  save();

  enterApp();
}


function sendOtp(){

  const loginId=document
    .getElementById('rs-id')
    .value
    .trim();

  if(!db.users.some(u=>u.loginId===loginId)){
    document.getElementById('reset1Err').textContent=
      'No account found with that Login Id.';
    return;
  }

  const code=String(
    Math.floor(100000+Math.random()*900000)
  );

  db.otp={
    loginId,
    code
  };

  save();

  document.getElementById('otpNote').textContent=
    'Demo mode: no real email is sent — your code is '+code;

  showScreen('reset2');
}


function doReset(){

  const code=document
    .getElementById('rs-otp')
    .value
    .trim();

  const newpass=document
    .getElementById('rs-newpass')
    .value;

  if(!db.otp||code!==db.otp.code){
    document.getElementById('reset2Err').textContent=
      'Incorrect code.';
    return;
  }

  if(!newpass){
    document.getElementById('reset2Err').textContent=
      'Enter a new password.';
    return;
  }

  db.users.find(
    u=>u.loginId===db.otp.loginId
  ).pass=newpass;

  db.otp=null;

  save();

  showScreen('login');

  document.getElementById('loginErr').style.color=
    'var(--up)';

  document.getElementById('loginErr').textContent=
    'Password updated — sign in with your new password.';
}


function doLogout(){

  db.session=null;

  save();

  document
    .getElementById('app')
    .classList.remove('on');

  document.getElementById('helpFab').classList.remove('show');

  document.getElementById('auth').style.display='flex';

  showScreen('login');
}


function enterApp(){

  document.getElementById('auth').style.display='none';

  document
    .getElementById('app')
    .classList.add('on');

  document.getElementById('helpFab').classList.add('show');

  document.getElementById('whoName').textContent=
    currentUser().name;

  document.getElementById('whoRole').textContent=
    '('+currentUser().role+')';

  applyRoleVisibility();

  switchTab('dashboard');
}


function currentUser(){
  return db.users.find(
    u=>u.loginId===db.session
  );
}


function isManager(){

  const u=currentUser();

  return !u || u.role==='Inventory Manager';
}


function applyRoleVisibility(){

  const staffOnly=!isManager();

  document.getElementById('nav-products').style.display=
    staffOnly?'none':'';

  document.getElementById('dd-settings').style.display=
    staffOnly?'none':'';
}


/* ================= helpers ================= */

function uid(){
  return db.nextDocId++;
}

function fmtDate(d){

  return new Date(d).toLocaleDateString(
    undefined,
    {
      month:'short',
      day:'numeric',
      year:'numeric'
    }
  );
}

function pill(status){

  return `
    <span class="pill p-${status.toLowerCase()}">
      ${status}
    </span>
  `;
}

function whList(){
  return db.warehouses;
}

function locList(){
  return db.locations;
}

function locName(code){

  const l=db.locations.find(
    l=>l.code===code
  );

  return l?l.name:code;
}

function productBySku(s){

  return db.products.find(
    p=>p.sku===s
  );
}

function onHand(p){

  return Object.values(p.stock)
    .reduce((a,b)=>a+b,0);
}

function reservedOf(p){

  return db.deliveries
    .filter(
      d=>d.status==='Ready'||d.status==='Waiting'
    )
    .flatMap(
      d=>d.lines
        .filter(l=>l.sku===p.sku)
        .map(l=>l.qty)
    )
    .reduce((a,b)=>a+b,0);
}

function freeToUse(p){

  return onHand(p)-reservedOf(p);
}

function isLow(p){

  const t=onHand(p);

  return t<=p.reorder&&t>0;
}

function isOut(p){

  return onHand(p)===0;
}

function nextRef(op){

  const code=db.warehouses[0]
    ?db.warehouses[0].code
    :'WH';

  return `${code}/${op}/${String(uid()).padStart(4,'0')}`;
}

function logLedger(
  ref,
  contact,
  from,
  to,
  product,
  qty,
  type,
  status
){

  db.ledger.unshift({
    id:Date.now()+Math.random(),
    date:new Date().toISOString(),
    ref,
    contact,
    from,
    to,
    product,
    qty,
    type,
    status
  });
}

function stockAt(sku,loc){

  const p=productBySku(sku);

  return p&&p.stock[loc]
    ?p.stock[loc]
    :0;
}

function hasStock(lines,fromLoc){

  return lines.every(
    l=>stockAt(l.sku,fromLoc)>=l.qty
  );
}


/* ================= tabs ================= */

let activeTab='dashboard';

let viewMode={
  receipts:'list',
  delivery:'list',
  history:'list'
};

const opsChildren=[
  'receipts',
  'delivery',
  'adjustments'
];

const settingsChildren=[
  'warehouses',
  'locations'
];

const managerOnlyTabs=[
  'products',
  'warehouses',
  'locations'
];


function switchTab(t){

  if(
    managerOnlyTabs.includes(t)
    && !isManager()
  ){
    t='dashboard';
  }

  activeTab=t;

  document
    .querySelectorAll('.topnav [data-tab]')
    .forEach(
      b=>b.classList.toggle(
        'active',
        b.dataset.tab===t
      )
    );

  document
    .getElementById('dd-ops')
    .querySelector('.dd-trigger')
    .classList.toggle(
      'active',
      opsChildren.includes(t)
    );

  document
    .getElementById('dd-settings')
    .querySelector('.dd-trigger')
    .classList.toggle(
      'active',
      settingsChildren.includes(t)
    );

  closeDropdowns();

  render();
}


function toggleDropdown(name,e){

  if(e) e.stopPropagation();

  const id='dd-'+name;

  document
    .querySelectorAll('.dropdown')
    .forEach(
      d=>{
        if(d.id!==id)
          d.classList.remove('open');
      }
    );

  document
    .getElementById(id)
    .classList.toggle('open');
}


function closeDropdowns(){

  document
    .querySelectorAll('.dropdown')
    .forEach(
      d=>d.classList.remove('open')
    );
}

document.addEventListener(
  'click',
  ()=>closeDropdowns()
);


function render(){

  const m=document.getElementById('main');

  const fns={

    dashboard:renderDashboard,

    guide:renderGuide,

    products:renderProducts,

    receipts:()=>renderDocList('receipts'),

    delivery:()=>renderDocList('delivery'),

    adjustments:renderAdjustments,

    stock:renderStock,

    history:renderHistory,

    warehouses:renderWarehouses,

    locations:renderLocations,

    profile:renderProfile
  };

  m.innerHTML=
    (fns[activeTab]||renderDashboard)();
}


/* ================= dashboard ================= */

/* ================= guide page ================= */

const guideSections=[
  {
    id:'why',
    t:'Why StockSense exists',
    open:true,
    why:'Spreadsheets don\'t stop two people from promising the same last unit to two different customers. A shared, live system does.',
    body:`
      <p>StockSense replaces scattered spreadsheets with one shared source of truth
      for stock: what you have, where it physically sits, what's already promised
      to a customer, and what needs reordering — updated the moment anyone logs a
      movement.</p>
    `
  },
  {
    id:'setup',
    t:'1. Warehouses &amp; Locations — set up where stock lives',
    why:'You can\'t track "how much" without first defining "where".',
    body:`
      <ol>
        <li>Go to <b>Settings ▾ → Warehouse</b> and add each physical site (e.g. Main Warehouse).</li>
        <li>Go to <b>Settings ▾ → Location</b> and add rooms/racks/bays inside that warehouse (e.g. Stock Room 1).</li>
        <li>Every product's stock is tracked per location, so create locations before adding stock quantities.</li>
      </ol>
    `
  },
  {
    id:'products',
    t:'2. Products — build your catalog',
    why:'A reorder point on each product is what powers the low-stock alerts on your Dashboard.',
    body:`
      <ol>
        <li>Open <b>Products</b> and click <b>+ New product</b>.</li>
        <li>Fill in name, SKU, category, unit of measure and cost.</li>
        <li>Set a <b>reorder point</b> — the level at which the product should show as "Low stock".</li>
      </ol>
    `
  },
  {
    id:'receipts',
    t:'3. Receipts — bring stock IN',
    why:'Nothing shows as "in stock" until a receipt confirms it physically arrived.',
    body:`
      <ol>
        <li>Open <b>Operations ▾ → Receipts</b> and click <b>+ New receipt</b>.</li>
        <li>Pick the supplier/contact, the destination location, and add product lines with quantities.</li>
        <li>Move the receipt through <b>Waiting → Ready → Done</b> as stock is checked in — quantities only add to stock once it's <b>Done</b>.</li>
      </ol>
    `
  },
  {
    id:'delivery',
    t:'4. Delivery — send stock OUT',
    why:'A "Ready" delivery reserves stock so it can\'t accidentally be promised twice.',
    body:`
      <ol>
        <li>Open <b>Operations ▾ → Delivery</b> and click <b>+ New delivery</b>.</li>
        <li>Choose the customer, source location, and the products/quantities to ship.</li>
        <li>Stock must be available at that location — StockSense reserves it once the delivery is Ready and deducts it when marked <b>Done</b>.</li>
      </ol>
    `
  },
  {
    id:'adjustments',
    t:'5. Adjustments — move or correct stock',
    why:'Physical counts never match the system perfectly forever — adjustments are how you fix that without a fake sale or purchase.',
    body:`
      <ol>
        <li>Open <b>Operations ▾ → Adjustments</b> to transfer stock between two locations, or correct a count after a stock-take.</li>
        <li>Every adjustment is logged so you can see exactly who changed what, and when.</li>
      </ol>
    `
  },
  {
    id:'stock-dash',
    t:'6. Dashboard &amp; Stock — keep an eye on things',
    why:'This is the page to check first thing each morning.',
    body:`
      <p><b>Dashboard</b> shows total products, inventory value, out-of-stock and
      low-stock counts, and how many receipts/deliveries are late or upcoming.</p>
      <p><b>Stock</b> shows, per product, how much is physically on-hand vs. how
      much is actually <b>free to use</b> (on-hand minus what's already reserved
      for a delivery).</p>
    `
  },
  {
    id:'history',
    t:'7. Move History — the audit trail',
    why:'When a number looks wrong, this is where you trace it back.',
    body:`<p>Every receipt, delivery and adjustment writes a line here — reference,
      product, quantity, from/to location and status — so you can trace any
      stock change back to the transaction that caused it.</p>`
  }
];

const guideFaq=[
  {
    q:'I\'m brand new — where do I actually start?',
    a:'Settings → Warehouse, then Location, then Products, then log your first Receipt. That order matters — each step needs the one before it.'
  },
  {
    q:'Why can\'t I deliver a product even though "on hand" shows stock?',
    a:'Check the Stock page: "free to use" may be lower than "on hand" because some units are already reserved by another open delivery.'
  },
  {
    q:'What\'s the difference between a Delivery and an Adjustment?',
    a:'Delivery = stock leaving to a real customer order. Adjustment = an internal move or correction with no sale involved.'
  },
  {
    q:'Where can I re-watch the quick tour?',
    a:'Tap the ? button in the bottom-right corner any time, or reopen it from this Guide page.'
  }
];

function renderGuide(){

  return `

    <h1 class="pg">📘 Guide</h1>
    <p class="sub">Why StockSense was built, and how to use every screen.</p>

    <div class="guide-hero">
      <h2>The problem this app solves</h2>
      <p>
        Manual spreadsheets can't stop two people from promising the same unit to
        two different customers, and they go stale the moment someone forgets to
        update a cell. StockSense keeps one live, shared record of what's in stock,
        where it physically is, and what's already spoken for — so the whole team
        works off the same numbers.
      </p>
      <button class="btn-sm" style="margin-top:14px;" onclick="openTour(false)">▶ Replay the 60‑second tour</button>
    </div>

    <div class="guide-grid">
      <div class="guide-step"><b>Step 1</b>Create Warehouses &amp; Locations</div>
      <div class="guide-step"><b>Step 2</b>Add Products + reorder points</div>
      <div class="guide-step"><b>Step 3</b>Receive opening stock</div>
      <div class="guide-step"><b>Step 4</b>Deliver, adjust, and monitor</div>
    </div>

    <h1 class="pg" style="font-size:16px;margin-bottom:10px;">Module-by-module walkthrough</h1>

    ${guideSections.map(s=>`

      <div class="acc-item ${s.open?'open':''}" id="acc-${s.id}">

        <button class="acc-head" onclick="toggleAcc('${s.id}')">
          <span>${s.t}</span>
          <span class="car">▾</span>
        </button>

        <div class="acc-body">
          ${s.why?`<div class="why">💡 <b>Why it matters:</b> ${s.why}</div>`:''}
          ${s.body}
        </div>

      </div>

    `).join('')}

    <h1 class="pg" style="font-size:16px;margin:24px 0 10px;">Frequently asked questions</h1>

    ${guideFaq.map((f,i)=>`

      <div class="acc-item faq-item" id="faq-${i}">

        <button class="acc-head" onclick="toggleAcc('faq-${i}',true)">
          <span>${f.q}</span>
          <span class="car">▾</span>
        </button>

        <div class="acc-body"><p>${f.a}</p></div>

      </div>

    `).join('')}

  `;
}

function toggleAcc(id,isFaq){

  const el=document.getElementById(
    isFaq?id:'acc-'+id
  );

  if(el) el.classList.toggle('open');
}


/* ================= contextual help (fab) ================= */

const helpTips={

  dashboard:['Dashboard','Your daily overview — total stock value, alerts for anything out or low on stock, and how many receipts/deliveries are late or upcoming.'],
  guide:['Guide','You\'re already on the full guide — scroll down for a module-by-module walkthrough and FAQs.'],
  receipts:['Receipts','Use this to log stock coming IN from a supplier. Add product lines, then move the receipt to "Done" once it\'s physically checked in — that\'s what adds it to stock.'],
  delivery:['Delivery','Use this to ship stock OUT to a customer. Marking it "Ready" reserves the stock so it can\'t be double-promised; "Done" deducts it.'],
  adjustments:['Adjustments','Move stock between two locations, or correct a count after a physical stock-take — no sale or purchase involved.'],
  products:['Products','Your catalog of SKUs. Set a reorder point on each one so the Dashboard can warn you before you run out.'],
  stock:['Stock','Shows on-hand quantity per location, plus "free to use" — on-hand minus what\'s already reserved by an open delivery.'],
  history:['Move History','A full audit trail — every receipt, delivery and adjustment, so you can trace any number back to what caused it.'],
  warehouses:['Warehouse','Your physical sites. Add one here before you can add locations inside it.'],
  locations:['Location','Rooms/racks/bays inside a warehouse — this is the actual level stock quantities are tracked at.'],
  profile:['My Profile','Your account details for this session.']
};

function openContextHelp(){

  const tip=helpTips[activeTab]||helpTips.dashboard;

  document.getElementById('modalBody').innerHTML=`

    <h3>${tip[0]}</h3>

    <div class="tour-body">
      <p>${tip[1]}</p>
    </div>

    <div class="modal-actions">
      <button class="btn-sm ghost" onclick="closeModal();switchTab('guide')">Open full guide</button>
      <button class="btn-sm" onclick="closeModal()">Got it</button>
    </div>

  `;

  openModal();
}


function renderDashboard(){

  const t=today();

  const openR=db.receipts.filter(
    d=>d.status!=='Done'
    &&d.status!=='Canceled'
  );

  const openD=db.deliveries.filter(
    d=>d.status!=='Done'
    &&d.status!=='Canceled'
  );

  const lateR=openR.filter(
    d=>d.schedule<t
  ).length;

  const upR=openR.filter(
    d=>d.schedule>t
  ).length;

  const lateD=openD.filter(
    d=>d.schedule<t
  ).length;

  const upD=openD.filter(
    d=>d.schedule>t
  ).length;

  const waitD=openD.filter(
    d=>d.status==='Waiting'
  ).length;

  const totalProducts=db.products.length;
  const totalOnHand=db.products.reduce((a,p)=>a+onHand(p),0);
  const totalValue=db.products.reduce((a,p)=>a+onHand(p)*p.cost,0);
  const lowStock=db.products.filter(isLow);
  const outStock=db.products.filter(isOut);
  const attention=[...outStock,...lowStock];

  return `

    <h1 class="pg">Dashboard</h1>

    <p class="sub">
      Current statistics across receipts and deliveries.
    </p>

    <div class="kpis" style="margin-bottom:10px;">

      <div class="kpi-card">
        <div class="kt">Total Products</div>
        <div class="krow"><span>Active SKUs</span><b>${totalProducts}</b></div>
        <div class="krow"><span>Units on hand</span><b>${totalOnHand}</b></div>
      </div>

      <div class="kpi-card">
        <div class="kt">Inventory Value</div>
        <div class="krow"><span>Total stock value</span><b>₹${totalValue.toLocaleString('en-IN')}</b></div>
        <div class="krow"><span>Warehouses / Locations</span><b>${db.warehouses.length} / ${db.locations.length}</b></div>
      </div>

      <div class="kpi-card">
        <div class="kt">Stock Alerts</div>
        <div class="krow late"><span>Out of stock</span><b>${outStock.length}</b></div>
        <div class="krow wait"><span>Low stock</span><b>${lowStock.length}</b></div>
      </div>

    </div>

    <div class="kpis">

      <div class="kpi-card">

        <div class="kt">
          Receipt · ${openR.length} to receive
        </div>

        <div class="krow late">
          <span>Late (past schedule date)</span>
          <b>${lateR}</b>
        </div>

        <div class="krow">
          <span>Upcoming operations</span>
          <b>${upR}</b>
        </div>

      </div>

      <div class="kpi-card">

        <div class="kt">
          Delivery · ${openD.length} to deliver
        </div>

        <div class="krow late">
          <span>Late (past schedule date)</span>
          <b>${lateD}</b>
        </div>

        <div class="krow wait">
          <span>Waiting on stock</span>
          <b>${waitD}</b>
        </div>

        <div class="krow">
          <span>Upcoming operations</span>
          <b>${upD}</b>
        </div>

      </div>

    </div>

    <div class="note">
      Late = schedule date before today · Upcoming = schedule date after today · Waiting = stock not yet available for delivery.
    </div>

    ${
      attention.length
      ?
      `
        <h1 class="pg" style="font-size:16px;margin-top:20px;">
          Needs attention
        </h1>
        <div class="tbl-wrap">
          <table>
            <thead>
              <tr><th>Product</th><th>SKU</th><th>On hand</th><th>Reorder at</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${attention.map(p=>`
                <tr>
                  <td>${p.name}</td>
                  <td>${p.sku}</td>
                  <td>${onHand(p)} ${p.uom}</td>
                  <td>${p.reorder}</td>
                  <td>${isOut(p)?pill('Canceled')+' Out of stock':pill('Waiting')+' Low stock'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `
      :
      ''
    }

    <h1 class="pg"
        style="font-size:16px;margin-top:20px;">
      Recent moves
    </h1>

    ${ledgerTable(db.ledger.slice(0,8))}
  `;
}


function ledgerTable(rows){

  if(!rows.length){

    return `
      <div class="empty">
        Nothing logged yet — moves will appear here as documents are validated.
      </div>
    `;
  }

  return `
    <div class="tbl-wrap">

      <table>

        <thead>

          <tr>
            <th>Reference</th>
            <th>Date</th>
            <th>Contact</th>
            <th>From</th>
            <th>To</th>
            <th>Qty</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          ${rows.map(
            r=>`

            <tr class="${
              r.type==='IN'
              ?'mv-in'
              :r.type==='OUT'
              ?'mv-out'
              :''
            }">

              <td>${r.ref}</td>

              <td>${fmtDate(r.date)}</td>

              <td>${r.contact||'—'}</td>

              <td>${r.from}</td>

              <td>${r.to}</td>

              <td>
                ${r.product} × ${r.qty}
              </td>

              <td>
                ${pill(r.status)}
              </td>

            </tr>

          `
          ).join('')}

        </tbody>

      </table>

    </div>
  `;
}


/* ================= Move History ================= */

function renderHistory(){

  return `

    <h1 class="pg">
      Move History
    </h1>

    <p class="sub">
      Every stock movement between locations — in moves in green, out moves in red.
    </p>

    <div class="toolbar">

      <div class="filters">

        <input
          id="hSearch"
          placeholder="Search reference or contact…"
          onkeyup="filterHistory()"
        >

      </div>

      ${viewToggleHtml('history')}

    </div>

    <div id="historyWrap">
      ${historyBody(db.ledger)}
    </div>

  `;
}


function historyBody(rows){

  if(viewMode.history==='list')
    return ledgerTable(rows);

  const statuses=[
    'Draft',
    'Waiting',
    'Ready',
    'Done'
  ];

  return `

    <div class="kanban">

      ${statuses.map(
        s=>`

        <div class="kcol">

          <h4>
            ${s}
            (${rows.filter(
              r=>r.status===s
            ).length})
          </h4>

          ${
            rows
              .filter(r=>r.status===s)
              .map(
                r=>`

                <div class="kcard">

                  <b>${r.ref}</b>

                  ${r.product} × ${r.qty}

                  <br>

                  ${r.from} → ${r.to}

                </div>

              `
              )
              .join('')
              ||
              '<div class="note">No items</div>'
          }

        </div>

      `
      ).join('')}

    </div>

  `;
}


function filterHistory(){

  const q=(
    document.getElementById('hSearch').value||''
  ).toLowerCase();

  document.getElementById('historyWrap')
    .innerHTML=
      historyBody(
        db.ledger.filter(
          r=>
            r.ref.toLowerCase().includes(q)
            ||
            (r.contact||'')
              .toLowerCase()
              .includes(q)
        )
      );
}


function viewToggleHtml(key){

  return `

    <div class="viewtoggle">

      <button
        class="${
          viewMode[key]==='list'
          ?'on'
          :''
        }"
        onclick="setView('${key}','list')">
        List
      </button>

      <button
        class="${
          viewMode[key]==='kanban'
          ?'on'
          :''
        }"
        onclick="setView('${key}','kanban')">
        Kanban
      </button>

    </div>

  `;
}


function setView(key,mode){

  viewMode[key]=mode;

  render();
}


/* ================= Products ================= */

function renderProducts(){

  return `

    <h1 class="pg">
      Products
    </h1>

    <p class="sub">
      Create products and set reordering rules.
    </p>

    <div class="toolbar">

      <div class="filters">

        <input
          id="prodSearch"
          placeholder="Search name or SKU…"
          onkeyup="filterProducts()"
        >

        <select id="prodCat" onchange="filterProducts()">
          <option value="">All categories</option>
          ${db.categories.map(c=>`<option value="${c}">${c}</option>`).join('')}
        </select>

      </div>

      <button
        class="btn-sm"
        onclick="openProductModal()">
        + New product
      </button>

    </div>

    <div id="prodTableWrap">
      ${productTable(db.products)}
    </div>

  `;
}


function productTable(list){

  if(!list.length)
    return `
      <div class="empty">
        No products match.
      </div>
    `;

  return `

    <div class="tbl-wrap">

      <table>

        <thead>

          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>UoM</th>
            <th>On hand</th>
            <th>Stock value</th>
            <th>Reorder at</th>
            <th>Status</th>
            <th></th>
          </tr>

        </thead>

        <tbody>

          ${list.map(
            p=>`

            <tr>

              <td>${p.name}</td>

              <td>${p.sku}</td>

              <td>${p.category}</td>

              <td>${p.uom}</td>

              <td>${onHand(p)}</td>

              <td>₹${(onHand(p)*p.cost).toLocaleString('en-IN')}</td>

              <td>${p.reorder}</td>

              <td>
                ${
                  isOut(p)
                  ?pill('Canceled')+' Out'
                  :isLow(p)
                  ?pill('Waiting')+' Low'
                  :pill('Done')+' OK'
                }
              </td>

              <td>

                <button
                  class="icon-btn"
                  onclick="openProductModal(${p.id})">
                  Edit
                </button>

              </td>

            </tr>

          `
          ).join('')}

        </tbody>

      </table>

    </div>

  `;
}


function filterProducts(){

  const q=(
    document.getElementById('prodSearch').value||''
  ).toLowerCase();

  const cat=document.getElementById('prodCat').value;

  document.getElementById('prodTableWrap')
    .innerHTML=
      productTable(
        db.products.filter(
          p=>
            (
              p.name.toLowerCase().includes(q)
              ||
              p.sku.toLowerCase().includes(q)
            )
            &&
            (!cat||p.category===cat)
        )
      );
}


function openProductModal(id){

  const p=id
    ?db.products.find(x=>x.id===id)
    :null;

  document.getElementById('modalBody').innerHTML=`

    <h3>
      ${p?'Edit product':'New product'}
    </h3>

    <div class="field">

      <label>Name</label>

      <input
        id="m-name"
        value="${p?p.name:''}"
      >

    </div>

    <div class="row2">

      <div class="field">

        <label>SKU / Code</label>

        <input
          id="m-sku"
          value="${p?p.sku:''}"
        >

      </div>

      <div class="field">

        <label>Unit of measure</label>

        <input
          id="m-uom"
          value="${p?p.uom:'unit'}"
        >

      </div>

    </div>

    <div class="row2">

      <div class="field">

        <label>Category</label>

        <select id="m-cat">

          ${db.categories.map(
            c=>`
              <option
                ${p&&p.category===c?'selected':''}>
                ${c}
              </option>
            `
          ).join('')}

        </select>

      </div>

      <div class="field">

        <label>Reorder point</label>

        <input
          id="m-reorder"
          type="number"
          value="${p?p.reorder:10}"
        >

      </div>

    </div>

    <div class="row2">

      <div class="field">

        <label>Per-unit cost (₹)</label>

        <input
          id="m-cost"
          type="number"
          value="${p?p.cost:0}"
        >

      </div>

      ${
        !p
        ?
        `
          <div class="field">

            <label>Initial stock</label>

            <input
              id="m-initstock"
              type="number"
              value="0"
            >

          </div>
        `
        :
        '<div></div>'
      }

    </div>

    <div class="modal-actions">

      <button
        class="btn-sm ghost"
        onclick="closeModal()">
        Cancel
      </button>

      <button
        class="btn-sm"
        onclick="saveProduct(${p?p.id:'null'})">
        Save
      </button>

    </div>

  `;

  openModal();
}


function saveProduct(id){

  const name=document
    .getElementById('m-name')
    .value
    .trim();

  const sku=document
    .getElementById('m-sku')
    .value
    .trim();

  if(!name||!sku){
    alert('Name and SKU are required.');
    return;
  }

  if(id){

    const p=db.products.find(
      x=>x.id===id
    );

    p.name=name;

    p.sku=sku;

    p.category=document
      .getElementById('m-cat')
      .value;

    p.uom=document
      .getElementById('m-uom')
      .value;

    p.reorder=+
      document
        .getElementById('m-reorder')
        .value;

    p.cost=+
      document
        .getElementById('m-cost')
        .value;

  }else{

    const stock={};

    db.locations.forEach(
      l=>stock[l.code]=0
    );

    stock[
      db.locations[0]
        ?db.locations[0].code
        :'Stock1'
    ]=
      +document
        .getElementById('m-initstock')
        .value||0;

    db.products.push({

      id:db.nextProductId++,

      name,

      sku,

      category:
        document
          .getElementById('m-cat')
          .value,

      uom:
        document
          .getElementById('m-uom')
          .value,

      reorder:
        +document
          .getElementById('m-reorder')
          .value,

      cost:
        +document
          .getElementById('m-cost')
          .value,

      stock

    });

  }

  save();

  closeModal();

  render();
}


/* ================= Stock page ================= */

function renderStock(){

  return `

    <h1 class="pg">
      Stock
    </h1>

    <p class="sub">
      Live on-hand quantities. Update the stock directly from here.
    </p>

    <div class="tbl-wrap">

      <table>

        <thead>

          <tr>
            <th>Product</th>
            <th>Per unit cost</th>
            <th>On hand</th>
            <th>Free to use</th>
            <th>Stock value</th>
            <th></th>
          </tr>

        </thead>

        <tbody>

          ${db.products.map(
            p=>`

            <tr>

              <td>${p.name}</td>

              <td>₹${p.cost}</td>

              <td>${onHand(p)}</td>

              <td>${freeToUse(p)}</td>

              <td>₹${(onHand(p)*p.cost).toLocaleString('en-IN')}</td>

              <td>

                <button
                  class="icon-btn"
                  onclick="openStockEdit(${p.id})">
                  Update stock
                </button>

              </td>

            </tr>

          `
          ).join('')}

        </tbody>

      </table>

    </div>

  `;
}


function openStockEdit(id){

  const p=db.products.find(
    x=>x.id===id
  );

  document.getElementById('modalBody').innerHTML=`

    <h3>
      Update stock — ${p.name}
    </h3>

    <p class="note">
      Enter the counted quantity per location; the difference is logged as an adjustment.
    </p>

    ${db.locations.map(
      l=>`

      <div class="field">

        <label>
          ${l.name} (${l.code})
        </label>

        <input
          class="stk-loc"
          data-code="${l.code}"
          type="number"
          value="${p.stock[l.code]||0}"
        >

      </div>

      `
    ).join('')}

    <div class="modal-actions">

      <button
        class="btn-sm ghost"
        onclick="closeModal()">
        Cancel
      </button>

      <button
        class="btn-sm"
        onclick="saveStockEdit(${id})">
        Save
      </button>

    </div>

  `;

  openModal();
}


function saveStockEdit(id){

  const p=db.products.find(
    x=>x.id===id
  );

  document
    .querySelectorAll('.stk-loc')
    .forEach(inp=>{

      const code=inp.dataset.code;

      const counted=+inp.value;

      const recorded=p.stock[code]||0;

      const delta=counted-recorded;

      if(delta!==0){

        p.stock[code]=counted;

        const ref=nextRef('ADJ');

        db.adjustments.push({

          id:uid(),

          ref,

          product:p.sku,

          location:code,

          recorded,

          counted,

          delta,

          date:new Date().toISOString()

        });

        logLedger(
          ref,
          '—',
          delta<0
            ?locName(code)
            :'—',
          delta<0
            ?'—'
            :locName(code),
          p.name,
          Math.abs(delta),
          delta>0
            ?'IN'
            :'OUT',
          'Done'
        );

      }

    });

  save();

  closeModal();

  render();
}


/* ================= Adjustments ================= */

function renderAdjustments(){

  return `

    <h1 class="pg">
      Adjustments
    </h1>

    <p class="sub">
      Every recount logged when stock is updated on the Stock page.
    </p>

    ${adjTable()}

  `;
}


function adjTable(){

  if(!db.adjustments.length){

    return `
      <div class="empty">
        No adjustments logged yet — update stock from the Stock page to log one.
      </div>
    `;
  }

  return `

    <div class="tbl-wrap">

      <table>

        <thead>

          <tr>
            <th>Ref</th>
            <th>Product</th>
            <th>Location</th>
            <th>Recorded</th>
            <th>Counted</th>
            <th>Δ</th>
            <th>Date</th>
          </tr>

        </thead>

        <tbody>

          ${db.adjustments
            .slice()
            .reverse()
            .map(
              d=>`

              <tr>

                <td>${d.ref}</td>

                <td>
                  ${productBySku(d.product)?.name||d.product}
                </td>

                <td>${locName(d.location)}</td>

                <td>${d.recorded}</td>

                <td>${d.counted}</td>

                <td
                  style="color:${
                    d.delta>0
                    ?'var(--up)'
                    :'var(--down)'
                  }">

                  ${d.delta>0?'+':''}${d.delta}

                </td>

                <td>${fmtDate(d.date)}</td>

              </tr>

            `
            )
            .join('')}

        </tbody>

      </table>

    </div>

  `;
}


/* ================= Receipts / Delivery ================= */

function docCfg(key){

  return key==='receipts'

    ?

    {
      list:'receipts',
      op:'IN',
      label:'Receipt',
      flow:[
        'Draft',
        'Ready',
        'Done'
      ],
      fromFixed:'Vendor',
      toFixed:null
    }

    :

    {
      list:'deliveries',
      op:'OUT',
      label:'Delivery',
      flow:[
        'Draft',
        'Waiting',
        'Ready',
        'Done'
      ],
      fromFixed:null,
      toFixed:'Customer'
    };
}


function renderDocList(key){

  const c=docCfg(key);

  const list=db[c.list];

  return `

    <h1 class="pg">
      ${c.label}
    </h1>

    <p class="sub">
      By default lands on list view. Search by reference or contact, or switch to kanban by status.
    </p>

    <div class="toolbar">

      <div class="filters">

        <input
          id="s-${key}"
          placeholder="Search reference or contact…"
          onkeyup="filterDocs('${key}')"
        >

      </div>

      <div style="display:flex;gap:8px;align-items:center;">

        ${viewToggleHtml(key)}

        ${
          isManager()
          ?
          `
            <button
              class="btn-sm"
              onclick="openDocModal('${key}')">
              + New
            </button>
          `
          :
          ''
        }

      </div>

    </div>

    <div id="docWrap-${key}">
      ${docBody(key,list)}
    </div>

  `;
}


function docBody(key,list){

  const c=docCfg(key);

  if(viewMode[key]==='kanban'){

    return `

      <div class="kanban">

        ${c.flow.map(
          s=>`

          <div class="kcol">

            <h4>
              ${s}
              (${list.filter(
                d=>d.status===s
              ).length})
            </h4>

            ${
              list
                .filter(d=>d.status===s)
                .map(
                  d=>`

                  <div
                    class="kcard ${
                      stockShort(key,d)
                      ?'stockout'
                      :''
                    }"
                    onclick="openDocDetail('${key}',${d.id})">

                    <b>${d.ref}</b>

                    ${d.contact||'—'}

                    <br>

                    ${fmtDate(d.schedule)}

                  </div>

                `
                )
                .join('')
                ||
                '<div class="note">No items</div>'
            }

          </div>

        `
        ).join('')}

      </div>

    `;
  }

  if(!list.length){

    return `
      <div class="empty">
        No documents yet. Create your first ${c.label.toLowerCase()}.
      </div>
    `;
  }

  return `

    <div class="tbl-wrap">

      <table>

        <thead>

          <tr>
            <th>Reference</th>
            <th>From</th>
            <th>To</th>
            <th>Contact</th>
            <th>Schedule date</th>
            <th>Status</th>
            <th></th>
          </tr>

        </thead>

        <tbody>

          ${list
            .slice()
            .reverse()
            .map(
              d=>`

              <tr>

                <td>${d.ref}</td>

                <td>${d.from}</td>

                <td>${d.to}</td>

                <td>${d.contact||'—'}</td>

                <td>${fmtDate(d.schedule)}</td>

                <td>${pill(d.status)}</td>

                <td>

                  <button
                    class="icon-btn"
                    onclick="openDocDetail('${key}',${d.id})">
                    Open
                  </button>

                </td>

              </tr>

            `
            )
            .join('')}

        </tbody>

      </table>

    </div>

  `;
}


function stockShort(key,d){

  if(key!=='delivery')
    return false;

  return !hasStock(
    d.lines,
    d.from
  );
}


function filterDocs(key){

  const q=(
    document
      .getElementById('s-'+key)
      .value||''
  ).toLowerCase();

  document.getElementById(
    'docWrap-'+key
  ).innerHTML=
    docBody(
      key,
      db[
        docCfg(key).list
      ].filter(
        d=>
          d.ref.toLowerCase().includes(q)
          ||
          (d.contact||'')
            .toLowerCase()
            .includes(q)
      )
    );
}


function openDocModal(key){

  const c=docCfg(key);

  document.getElementById('modalBody').innerHTML=`

    <h3>
      New ${c.label.toLowerCase()}
    </h3>

    <div class="field">

      <label>Contact</label>

      <input
        id="d-contact"
        placeholder="e.g. Acme Interiors"
      >

    </div>

    <div class="row2">

      <div class="field">

        <label>From</label>

        ${
          c.fromFixed
          ?
          `<input value="${c.fromFixed}" disabled>`
          :
          `
            <select id="d-from">

              ${db.locations.map(
                l=>`

                <option value="${l.code}">
                  ${l.name} (${l.code})
                </option>

                `
              ).join('')}

            </select>
          `
        }

      </div>

      <div class="field">

        <label>To</label>

        ${
          c.toFixed
          ?
          `<input value="${c.toFixed}" disabled>`
          :
          `
            <select id="d-to">

              ${db.locations.map(
                l=>`

                <option value="${l.code}">
                  ${l.name} (${l.code})
                </option>

                `
              ).join('')}

            </select>
          `
        }

      </div>

    </div>

    <div class="field">

      <label>Schedule date</label>

      <input
        id="d-sched"
        type="date"
        value="${today()}"
      >

    </div>

    <div class="field">

      <label>Responsible</label>

      <input
        id="d-resp"
        value="${currentUser().name}"
        disabled
      >

    </div>

    <div class="field">

      <label>Products</label>

      <div id="docLines"></div>

      <button
        class="btn-sm ghost"
        style="width:auto;padding:6px 10px;font-size:12px;"
        onclick="addDocLine()">
        + Add product
      </button>

    </div>

    <div class="modal-actions">

      <button
        class="btn-sm ghost"
        onclick="closeModal()">
        Cancel
      </button>

      <button
        class="btn-sm"
        onclick="saveDoc('${key}')">
        Save as draft
      </button>

    </div>

  `;

  openModal();

  addDocLine();
}


function addDocLine(){

  const wrap=document.getElementById(
    'docLines'
  );

  const row=document.createElement('div');

  row.className='line-item';

  row.innerHTML=`

    <select class="dl-prod">

      ${db.products.map(
        p=>`

        <option value="${p.sku}">
          [${p.sku}] ${p.name}
        </option>

        `
      ).join('')}

    </select>

    <input
      class="dl-qty"
      type="number"
      min="1"
      value="1"
    >

    <button
      onclick="this.parentElement.remove()">
      ✕
    </button>

  `;

  wrap.appendChild(row);
}


function saveDoc(key){

  const c=docCfg(key);

  const contact=document
    .getElementById('d-contact')
    .value
    .trim();

  const from=
    c.fromFixed
    ||
    document.getElementById('d-from').value;

  const to=
    c.toFixed
    ||
    document.getElementById('d-to').value;

  const schedule=
    document.getElementById('d-sched').value;

  const lines=[
    ...document.querySelectorAll(
      '#docLines .line-item'
    )
  ]
  .map(
    r=>({

      sku:
        r.querySelector('.dl-prod').value,

      product:
        productBySku(
          r.querySelector('.dl-prod').value
        ).name,

      qty:
        +r.querySelector('.dl-qty').value

    })
  )
  .filter(
    l=>l.qty>0
  );

  if(!lines.length){

    alert(
      'Add at least one product.'
    );

    return;
  }

  const ref=nextRef(c.op);

  const status=
    (
      key==='delivery'
      &&
      !hasStock(lines,from)
    )
    ?
    'Waiting'
    :
    'Draft';

  db[c.list].push({

    id:Date.now(),

    ref,

    contact,

    from,

    to,

    schedule,

    responsible:
      currentUser().name,

    status:'Draft',

    lines,

    date:
      new Date().toISOString()

  });

  save();

  closeModal();

  render();
}


function openDocDetail(key,id){

  const c=docCfg(key);

  const d=db[c.list].find(
    x=>x.id===id
  );

  const idx=c.flow.indexOf(
    d.status
  );

  const nextLabel=
    d.status==='Draft'
    ?
    'Mark as Ready'
    :
    (
      d.status==='Waiting'
      ?
      'Recheck stock'
      :
      (
        d.status==='Ready'
        ?
        'Validate'
        :
        null
      )
    );

  document.getElementById(
    'modalBody'
  ).innerHTML=`

    <h3>
      ${c.label} — ${d.ref}
    </h3>

    <div class="stepper">

      ${c.flow.map(
        (s,i)=>
          `${i>0?' → ':''}${
            i<=idx
            ?'<b>'+s+'</b>'
            :s
          }`
      ).join('')}

    </div>

    <div class="row2">

      <div class="field">

        <label>
          ${
            key==='receipts'
            ?'Receive From'
            :'Delivery Address'
          }
        </label>

        <input
          value="${d.from}"
          disabled
        >

      </div>

      <div class="field">

        <label>
          Schedule date
        </label>

        <input
          value="${fmtDate(d.schedule)}"
          disabled
        >

      </div>

    </div>

    <div class="row2">

      <div class="field">

        <label>Contact</label>

        <input
          value="${d.contact||'—'}"
          disabled
        >

      </div>

      <div class="field">

        <label>Responsible</label>

        <input
          value="${d.responsible}"
          disabled
        >

      </div>

    </div>

    <div class="tbl-wrap">

      <table>

        <thead>

          <tr>
            <th>Product</th>
            <th>Quantity</th>
          </tr>

        </thead>

        <tbody>

          ${d.lines.map(
            l=>`

            <tr>

              <td>
                [${l.sku}] ${l.product}
              </td>

              <td>
                ${l.qty}
              </td>

            </tr>

          `
          ).join('')}

        </tbody>

      </table>

    </div>

    ${
      key==='delivery'
      &&
      !hasStock(d.lines,d.from)
      &&
      d.status!=='Done'
      ?
      `
        <p class="err">
          Not enough stock at ${d.from} to fulfil this order.
        </p>
      `
      :
      ''
    }

    <div class="modal-actions">

      ${
        d.status!=='Done'
        &&
        d.status!=='Canceled'
        &&
        isManager()
        ?
        `
          <button
            class="btn-sm ghost"
            onclick="cancelDoc('${key}',${id})">
            Cancel
          </button>
        `
        :
        ''
      }

      ${
        d.status==='Done'
        ?
        `
          <button
            class="btn-sm ghost"
            onclick="window.print()">
            Print
          </button>
        `
        :
        ''
      }

      ${
        nextLabel
        ?
        `
          <button
            class="btn-sm"
            onclick="advanceDoc('${key}',${id})">
            ${nextLabel}
          </button>
        `
        :
        ''
      }

      <button
        class="btn-sm ghost"
        onclick="closeModal()">
        Close
      </button>

    </div>

  `;

  openModal();
}


function advanceDoc(key,id){

  const c=docCfg(key);

  const d=db[c.list].find(
    x=>x.id===id
  );

  if(d.status==='Draft'){

    d.status=
      (
        key==='delivery'
        &&
        !hasStock(d.lines,d.from)
      )
      ?
      'Waiting'
      :
      'Ready';

  }

  else if(d.status==='Waiting'){

    d.status=
      hasStock(d.lines,d.from)
      ?
      'Ready'
      :
      'Waiting';

  }

  else if(d.status==='Ready'){

    d.lines.forEach(
      l=>{

        const p=
          productBySku(l.sku);

        if(!p) return;

        if(key==='receipts'){

          p.stock[d.to]=
            (p.stock[d.to]||0)+l.qty;

          logLedger(
            d.ref,
            d.contact,
            d.from,
            locName(d.to),
            p.name,
            l.qty,
            'IN',
            d.status
          );

        }

        else{

          p.stock[d.from]=
            (p.stock[d.from]||0)-l.qty;

          logLedger(
            d.ref,
            d.contact,
            locName(d.from),
            d.to,
            p.name,
            l.qty,
            'OUT',
            d.status
          );

        }

      }
    );

    d.status='Done';
  }

  save();

  openDocDetail(key,id);

  render();
}


function cancelDoc(key,id){

  const c=docCfg(key);

  const d=db[c.list].find(
    x=>x.id===id
  );

  d.status='Canceled';

  save();

  closeModal();

  render();
}


/* ================= Warehouse / Location ================= */

function renderWarehouses(){

  return `

    <h1 class="pg">
      Warehouse
    </h1>

    <p class="sub">
      Warehouse details & location.
    </p>

    <div class="toolbar">

      <div></div>

      <button
        class="btn-sm"
        onclick="openWhModal()">
        + New warehouse
      </button>

    </div>

    <div class="tbl-wrap">

      <table>

        <thead>

          <tr>
            <th>Name</th>
            <th>Short code</th>
            <th>Address</th>
          </tr>

        </thead>

        <tbody>

          ${db.warehouses.map(
            w=>`

            <tr>

              <td>${w.name}</td>

              <td>${w.code}</td>

              <td>${w.address}</td>

            </tr>

          `
          ).join('')}

        </tbody>

      </table>

    </div>

  `;
}


function openWhModal(){

  document.getElementById(
    'modalBody'
  ).innerHTML=`

    <h3>Warehouse</h3>

    <div class="field">

      <label>Name</label>

      <input id="w-name">

    </div>

    <div class="field">

      <label>Short Code</label>

      <input id="w-code">

    </div>

    <div class="field">

      <label>Address</label>

      <input id="w-addr">

    </div>

    <div class="modal-actions">

      <button
        class="btn-sm ghost"
        onclick="closeModal()">
        Cancel
      </button>

      <button
        class="btn-sm"
        onclick="saveWh()">
        Save
      </button>

    </div>

  `;

  openModal();
}


function saveWh(){

  const name=
    document
      .getElementById('w-name')
      .value
      .trim();

  const code=
    document
      .getElementById('w-code')
      .value
      .trim();

  const address=
    document
      .getElementById('w-addr')
      .value
      .trim();

  if(!name||!code){

    alert(
      'Name and short code are required.'
    );

    return;
  }

  db.warehouses.push({

    id:db.nextWhId++,

    name,

    code,

    address

  });

  save();

  closeModal();

  render();
}


function renderLocations(){

  return `

    <h1 class="pg">
      Location
    </h1>

    <p class="sub">
      Holds the multiple locations of a warehouse — rooms, racks, etc.
    </p>

    <div class="toolbar">

      <div></div>

      <button
        class="btn-sm"
        onclick="openLocModal()">
        + New location
      </button>

    </div>

    <div class="tbl-wrap">

      <table>

        <thead>

          <tr>
            <th>Name</th>
            <th>Short code</th>
            <th>Warehouse</th>
            <th>Products stocked</th>
          </tr>

        </thead>

        <tbody>

          ${db.locations.map(
            l=>`

            <tr>

              <td>${l.name}</td>

              <td>${l.code}</td>

              <td>
                ${
                  db.warehouses.find(
                    w=>w.id===l.warehouseId
                  )?.name||'—'
                }
              </td>

              <td>
                ${
                  db.products.filter(
                    p=>(p.stock[l.code]||0)>0
                  ).length
                }
              </td>

            </tr>

          `
          ).join('')}

        </tbody>

      </table>

    </div>

  `;
}


function openLocModal(){

  document.getElementById(
    'modalBody'
  ).innerHTML=`

    <h3>Location</h3>

    <div class="field">

      <label>Name</label>

      <input id="l-name">

    </div>

    <div class="field">

      <label>Short Code</label>

      <input id="l-code">

    </div>

    <div class="field">

      <label>Warehouse</label>

      <select id="l-wh">

        ${db.warehouses.map(
          w=>`

          <option value="${w.id}">
            ${w.name}
          </option>

          `
        ).join('')}

      </select>

    </div>

    <div class="modal-actions">

      <button
        class="btn-sm ghost"
        onclick="closeModal()">
        Cancel
      </button>

      <button
        class="btn-sm"
        onclick="saveLoc()">
        Save
      </button>

    </div>

  `;

  openModal();
}


function saveLoc(){

  const name=
    document
      .getElementById('l-name')
      .value
      .trim();

  const code=
    document
      .getElementById('l-code')
      .value
      .trim();

  const warehouseId=
    +document
      .getElementById('l-wh')
      .value;

  if(!name||!code){

    alert(
      'Name and short code are required.'
    );

    return;
  }

  db.locations.push({

    id:db.nextLocId++,

    name,

    code,

    warehouseId

  });

  db.products.forEach(
    p=>{
      if(!(code in p.stock))
        p.stock[code]=0;
    }
  );

  save();

  closeModal();

  render();
}


/* ================= profile ================= */

function renderProfile(){

  const u=currentUser();

  return `

    <h1 class="pg">
      My Profile
    </h1>

    <div
      class="field"
      style="max-width:340px">

      <label>Name</label>

      <input
        value="${u.name}"
        disabled
      >

    </div>

    <div
      class="field"
      style="max-width:340px">

      <label>Login Id</label>

      <input
        value="${u.loginId}"
        disabled
      >

    </div>

    <div
      class="field"
      style="max-width:340px">

      <label>Email</label>

      <input
        value="${u.email}"
        disabled
      >

    </div>

    <div
      class="field"
      style="max-width:340px">

      <label>Role</label>

      <input
        value="${u.role}"
        disabled
      >

    </div>

  `;
}


/* ================= modal ================= */

function openModal(){

  document
    .getElementById('modalBg')
    .classList.add('on');
}

function closeModal(){

  document
    .getElementById('modalBg')
    .classList.remove('on');
}

document
  .getElementById('modalBg')
  .addEventListener(
    'click',
    e=>{
      if(e.target.id==='modalBg')
        closeModal();
    }
  );


/* ================= interactive background ================= */

(function(){
  const canvas=document.getElementById('bgcanvas');
  const ctx=canvas.getContext('2d');
  let w,h,dots=[];
  const mouse={x:-9999,y:-9999};

  function isDark(){
    return document.documentElement
      .getAttribute('data-theme')==='dark';
  }

  function resize(){
    w=canvas.width=window.innerWidth;
    h=canvas.height=window.innerHeight;
    const count=Math.max(30,Math.min(70,Math.floor(w*h/22000)));
    dots=Array.from({length:count},()=>({
      x:Math.random()*w,
      y:Math.random()*h,
      r:1+Math.random()*2.2,
      vx:(Math.random()-.5)*.25,
      vy:(Math.random()-.5)*.25
    }));
  }

  function step(){
    ctx.clearRect(0,0,w,h);
    const dark=isDark();
    const dotColor=dark?'96,168,148':'61,107,82';
    const lineColor=dark?'120,160,200':'75,120,160';

    dots.forEach(d=>{
      d.x+=d.vx; d.y+=d.vy;

      const dx=mouse.x-d.x, dy=mouse.y-d.y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<120){
        d.x-=dx/dist*0.6;
        d.y-=dy/dist*0.6;
      }

      if(d.x<0||d.x>w) d.vx*=-1;
      if(d.y<0||d.y>h) d.vy*=-1;

      d.x=Math.max(0,Math.min(w,d.x));
      d.y=Math.max(0,Math.min(h,d.y));
    });

    for(let i=0;i<dots.length;i++){
      for(let j=i+1;j<dots.length;j++){
        const a=dots[i], b=dots[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<110){
          ctx.strokeStyle=`rgba(${lineColor},${(1-dist/110)*.18})`;
          ctx.lineWidth=1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }

    dots.forEach(d=>{
      ctx.beginPath();
      ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${dotColor},.55)`;
      ctx.fill();
    });

    requestAnimationFrame(step);
  }

  function setGlow(x,y){
    const root=document.documentElement;
    root.style.setProperty('--mx',x+'px');
    root.style.setProperty('--my',y+'px');
  }

  window.addEventListener('resize',resize);
  window.addEventListener('mousemove',e=>{
    mouse.x=e.clientX; mouse.y=e.clientY;
    setGlow(e.clientX,e.clientY);
  });
  window.addEventListener('mouseleave',()=>{
    mouse.x=-9999; mouse.y=-9999;
  });
  window.addEventListener('touchmove',e=>{
    if(e.touches[0]){
      mouse.x=e.touches[0].clientX;
      mouse.y=e.touches[0].clientY;
      setGlow(e.touches[0].clientX,e.touches[0].clientY);
    }
  },{passive:true});

  resize();
  step();
})();


/* ================= boot ================= */

if(
  db.session
  &&
  db.users.some(
    u=>u.loginId===db.session
  )
){

  enterApp();

}else{

  showScreen('login');

  if(!localStorage.getItem('stocksense_intro_seen')){
    setTimeout(()=>openTour(true),700);
  }

}

