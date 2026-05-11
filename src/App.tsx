import React, { useEffect, useMemo, useState } from "react";

const START_SOULS = 10247;
const GOAL = 1000000000;

const initialPosts = [
  {
    id: 1,
    author: "GoYe Baltimore",
    city: "Baltimore, MD",
    type: "City Invasion",
    text: "Baltimore outreach team reported 42 people ministered to and 9 salvation decisions reported. Glory to God.",
    souls: 9,
    image: "linear-gradient(135deg,#0b1622,#c9a84c)",
    reactions: 122,
    comments: 18,
  },
  {
    id: 2,
    author: "Ama Boateng",
    city: "Kumasi, Ghana",
    type: "One Leper Testimony",
    text: "I shared my testimony with a friend today. She said she wants to return to God and start praying again.",
    souls: 1,
    image: "linear-gradient(135deg,#14395f,#2ecc8a)",
    reactions: 88,
    comments: 11,
  },
  {
    id: 3,
    author: "GoYe DC Prayer Walkers",
    city: "Washington, DC",
    type: "Outreach Update",
    text: "Prayer walk completed. We prayed for families, schools, and open doors for the Gospel in the city.",
    souls: 0,
    image: "linear-gradient(135deg,#0b1622,#4a8fd9)",
    reactions: 64,
    comments: 7,
  },
];

const harvestMates = [
  { id: 1, name: "Sarah M.", city: "Baltimore", badge: "Prayer Partner", streak: 8 },
  { id: 2, name: "David K.", city: "Washington, DC", badge: "Street Evangelist", streak: 14 },
  { id: 3, name: "Ama B.", city: "Silver Spring", badge: "Co-Soul Winner", streak: 5 },
  { id: 4, name: "Kwame A.", city: "Kumasi", badge: "Campus Witness", streak: 21 },
];

const groups = [
  { id: 1, name: "GoYe Baltimore Soul Winners", city: "Baltimore", members: 42, souls: 318 },
  { id: 2, name: "DC Prayer Walkers", city: "Washington, DC", members: 31, souls: 144 },
  { id: 3, name: "Kumasi Campus Evangelism", city: "Kumasi", members: 78, souls: 620 },
  { id: 4, name: "London Street Outreach", city: "London", members: 56, souls: 401 },
];

const events = [
  { id: 1, title: "Baltimore City Invasion", city: "Baltimore", date: "May 25", type: "City Invasion", souls: 214 },
  { id: 2, title: "DC Prayer Walk", city: "Washington, DC", date: "June 2", type: "Prayer Walk", souls: 36 },
];

export default function App() {
  const [tab, setTab] = useState("home");
  const [tier, setTier] = useState(() => localStorage.getItem("tier") || "Sent");
  const [souls, setSouls] = useState(() => Number(localStorage.getItem("souls")) || START_SOULS);
  const [posts, setPosts] = useState(() => JSON.parse(localStorage.getItem("posts")) || initialPosts);
  const [mates, setMates] = useState(() => JSON.parse(localStorage.getItem("mates")) || []);
  const [joinedGroups, setJoinedGroups] = useState(() => JSON.parse(localStorage.getItem("joinedGroups")) || []);
  const [streak, setStreak] = useState(() => Number(localStorage.getItem("streak")) || 3);
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ type: "Evangelism Story", text: "", souls: 0 });
  const [celebrate, setCelebrate] = useState("🎉 10,000 souls reached so far. Glory to God!");

  useEffect(() => localStorage.setItem("tier", tier), [tier]);
  useEffect(() => localStorage.setItem("souls", souls), [souls]);
  useEffect(() => localStorage.setItem("posts", JSON.stringify(posts)), [posts]);
  useEffect(() => localStorage.setItem("mates", JSON.stringify(mates)), [mates]);
  useEffect(() => localStorage.setItem("joinedGroups", JSON.stringify(joinedGroups)), [joinedGroups]);
  useEffect(() => localStorage.setItem("streak", streak), [streak]);

  const percent = useMemo(() => ((souls / GOAL) * 100).toFixed(5), [souls]);

  function addMate(person) {
    if (tier === "Sent" && mates.length >= 2) {
      alert("Free users can add up to 2 Harvest Mates. Upgrade to Laborer for unlimited Harvest Mates.");
      return;
    }
    if (!mates.find((m) => m.id === person.id)) setMates([...mates, person]);
  }

  function joinGroup(group) {
    if (tier === "Sent" && joinedGroups.length >= 3) {
      alert("Free users can join up to 3 groups. Upgrade to Laborer for unlimited groups.");
      return;
    }
    if (!joinedGroups.find((g) => g.id === group.id)) setJoinedGroups([...joinedGroups, group]);
  }

  function submitPost() {
    if (!newPost.text.trim()) return alert("Write something first.");
    const count = Number(newPost.souls) || 0;
    const post = {
      id: Date.now(),
      author: "You",
      city: "Maryland",
      type: newPost.type,
      text: newPost.text,
      souls: count,
      image: "linear-gradient(135deg,#112033,#e8c96d)",
      reactions: 0,
      comments: 0,
    };
    setPosts([post, ...posts]);
    if (count > 0) {
      setSouls(souls + count);
      setCelebrate(`🎉 ${count} souls reached reported. Glory to God!`);
    }
    setNewPost({ type: "Evangelism Story", text: "", souls: 0 });
    setShowCreate(false);
  }

  function nightCheckIn() {
    const count = Number(prompt("How many people were ministered to or reached today?")) || 0;
    setStreak(streak + 1);
    if (count > 0) {
      setSouls(souls + count);
      setCelebrate(`🎉 ${count} people ministered to today. Keep going!`);
      setPosts([
        {
          id: Date.now(),
          author: "You",
          city: "Maryland",
          type: "Daily Check-In",
          text: `Completed night check-in. ${count} people ministered to today.`,
          souls: count,
          image: "linear-gradient(135deg,#0b1622,#2ecc8a)",
          reactions: 0,
          comments: 0,
        },
        ...posts,
      ]);
    }
  }

  return (
    <div className="app">
      <style>{styles}</style>

      <header className="topbar">
        <div className="logo">
          <div className="mark">✝</div>
          <div>
            <b>GoYe Connect</b>
            <span>Kingdom social network for soul winners</span>
          </div>
        </div>
        <div className="icons">
          <button>🔍</button>
          <button>🔔</button>
          <button onClick={() => setShowCreate(true)}>＋</button>
        </div>
      </header>

      <main>
        {tab === "home" && (
          <>
            <section className="goal">
              <div>
                <small>THE GREAT COMMISSION GOAL</small>
                <h1>1 Billion Souls</h1>
                <p>{souls.toLocaleString()} souls reached reported so far</p>
              </div>
              <div className="ring">{percent}%</div>
              <div className="bar"><span style={{ width: `${Math.min(percent * 2500, 100)}%` }} /></div>
              <div className="miniStats">
                <div><b>+381</b><span>Today</span></div>
                <div><b>+4,920</b><span>This week</span></div>
                <div><b>90%</b><span>Net app profits to missions</span></div>
              </div>
              <div className="celebrate">{celebrate}</div>
            </section>

            <section className="stories">
              {["Your Testimony", "One Leper", "Upper Room", "City Invasion", "Daily Charge"].map((s, i) => (
                <div className="story" key={s}>
                  <div className={`storyImg s${i}`}>▶</div>
                  <span>{s}</span>
                </div>
              ))}
            </section>

            <section className="composer" onClick={() => setShowCreate(true)}>
              <div className="avatar">Y</div>
              <p>Share an evangelism story, testimony, prayer request, or outreach update...</p>
            </section>

            <section className="daily">
              <h3>Daily Commission</h3>
              <p><b>Mission:</b> Pray for one person and ask God for an open door.</p>
              <p><b>Scripture:</b> “Go therefore and make disciples of all nations.” Matthew 28:19</p>
              <button onClick={() => alert("Morning mission started. Ask God for boldness today.")}>Morning Check-In</button>
              <button onClick={nightCheckIn}>Night Check-In</button>
            </section>

            <Feed posts={posts} setPosts={setPosts} />
          </>
        )}

        {tab === "network" && (
          <section>
            <h2>Harvest Mates</h2>
            <p className="muted">Add co-soul winners for evangelism accountability.</p>
            <div className="cards">
              {harvestMates.map((p) => (
                <div className="person" key={p.id}>
                  <div className="avatar">{p.name[0]}</div>
                  <h3>{p.name}</h3>
                  <p>{p.city}</p>
                  <small>{p.badge} • 🔥 {p.streak} day streak</small>
                  <button onClick={() => addMate(p)}>{mates.find((m) => m.id === p.id) ? "Added" : "Add Harvest Mate"}</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "groups" && (
          <section>
            <h2>Evangelism Groups</h2>
            <p className="muted">Join city, church, campus, and outreach teams.</p>
            <div className="cards">
              {groups.map((g) => (
                <div className="group" key={g.id}>
                  <div className="groupBanner">🌍</div>
                  <h3>{g.name}</h3>
                  <p>{g.city}</p>
                  <small>{g.members} members • {g.souls} souls reached reported</small>
                  <button onClick={() => joinGroup(g)}>{joinedGroups.find((x) => x.id === g.id) ? "Joined" : "Join Group"}</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "outreach" && (
          <section>
            <h2>Outreach Events</h2>
            <div className="cityInvasion">
              <h3>Baltimore City Invasion</h3>
              <p>Teams gathering for prayer, evangelism, and city-wide outreach.</p>
              <div className="miniStats">
                <div><b>12</b><span>Teams</span></div>
                <div><b>214</b><span>Souls reached</span></div>
                <div><b>73</b><span>Prayer partners</span></div>
              </div>
              <button>Join City Invasion</button>
              <button onClick={() => { setSouls(souls + 5); setCelebrate("🎉 City Invasion report added: 5 souls reached."); }}>Report Impact</button>
            </div>

            {events.map((e) => (
              <div className="event" key={e.id}>
                <b>{e.type}</b>
                <h3>{e.title}</h3>
                <p>{e.city} • {e.date}</p>
                <small>{e.souls} souls reached reported</small>
                <button>RSVP</button>
              </div>
            ))}
          </section>
        )}

        {tab === "reels" && (
          <section>
            <h2>Kingdom Reels</h2>
            <div className="reels">
              {["Turning Point clip", "Street evangelism", "One Leper testimony", "Daily Charge"].map((r, i) => (
                <div className={`reel r${i}`} key={r}>
                  <div className="play">▶</div>
                  <b>{r}</b>
                  <span>Tap to watch</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "prayer" && (
          <section>
            <h2>Prayer Wall</h2>
            {["Pray for boldness for outreach this weekend.", "Praying for new believers to be discipled well.", "Thank God for answered prayer in our city group."].map((p, i) => (
              <div className="prayer" key={i}>
                <p>{p}</p>
                <button>🙏 I prayed</button>
              </div>
            ))}
          </section>
        )}

        {tab === "profile" && (
          <section>
            <div className="profile">
              <div className="avatar big">Y</div>
              <h2>Your GoYe Profile</h2>
              <p>{tier} Tier • {tier === "Sent" ? "Free" : tier === "Laborer" ? "$4.99/mo" : "$14.99/mo"}</p>
              <div className="miniStats">
                <div><b>{streak}</b><span>Streak</span></div>
                <div><b>{mates.length}</b><span>Harvest Mates</span></div>
                <div><b>{joinedGroups.length}</b><span>Groups</span></div>
              </div>
            </div>

            <h3>Subscription</h3>
            <div className="tiers">
              {["Sent", "Laborer", "Field Leader"].map((t) => (
                <div className={`tier ${tier === t ? "selected" : ""}`} key={t}>
                  <h3>{t}</h3>
                  <p>{t === "Sent" ? "Free" : t === "Laborer" ? "$4.99/month" : "$14.99/month"}</p>
                  <small>
                    {t === "Sent" && "Basic mission tools, 2 Harvest Mates, 3 groups."}
                    {t === "Laborer" && "Unlimited Harvest Mates, groups, events, analytics."}
                    {t === "Field Leader" && "Create groups, create events, manage teams."}
                  </small>
                  <button onClick={() => setTier(t)}>{tier === t ? "Current" : "Choose"}</button>
                </div>
              ))}
            </div>

            <div className="missionMoney">90% of GoYe Connect net app profits support accountable Go Ye missions worldwide.</div>
            <button className="reset" onClick={() => { localStorage.clear(); location.reload(); }}>Reset Demo</button>
          </section>
        )}
      </main>

      {showCreate && (
        <div className="modal">
          <div className="sheet">
            <button className="close" onClick={() => setShowCreate(false)}>×</button>
            <h2>Create Kingdom Post</h2>
            <select value={newPost.type} onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}>
              <option>Evangelism Story</option>
              <option>Prayer Request</option>
              <option>One Leper Testimony</option>
              <option>Outreach Update</option>
              <option>City Invasion Report</option>
            </select>
            <textarea placeholder="Share what God is doing..." value={newPost.text} onChange={(e) => setNewPost({ ...newPost, text: e.target.value })} />
            <input type="number" placeholder="Souls reached reported optional" value={newPost.souls} onChange={(e) => setNewPost({ ...newPost, souls: e.target.value })} />
            <button onClick={submitPost}>Post</button>
          </div>
        </div>
      )}

      <nav>
        {[
          ["home", "🏠", "Home"],
          ["network", "👥", "Mates"],
          ["groups", "🌍", "Groups"],
          ["outreach", "📍", "Outreach"],
          ["reels", "▶️", "Reels"],
          ["prayer", "🙏", "Prayer"],
          ["profile", "👤", "Profile"],
        ].map(([id, icon, label]) => (
          <button key={id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}>
            <span>{icon}</span>
            <small>{label}</small>
          </button>
        ))}
      </nav>
    </div>
  );
}

function Feed({ posts, setPosts }) {
  return (
    <section className="feedList">
      {posts.map((p) => (
        <article className="post" key={p.id}>
          <div className="postHead">
            <div className="avatar">{p.author[0]}</div>
            <div>
              <b>{p.author}</b>
              <small>{p.city} • {p.type}</small>
            </div>
          </div>
          <p>{p.text}</p>
          <div className="image" style={{ background: p.image }}>
            <span>{p.type}</span>
          </div>
          {p.souls > 0 && <div className="souls">🔥 {p.souls} souls reached reported</div>}
          <div className="actions">
            <button onClick={() => setPosts(posts.map((x) => x.id === p.id ? { ...x, reactions: x.reactions + 1 } : x))}>👍 {p.reactions}</button>
            <button>💬 {p.comments}</button>
            <button>🙏 Pray</button>
            <button>↗ Share</button>
          </div>
        </article>
      ))}
    </section>
  );
}

const styles = `
*{box-sizing:border-box}
body{margin:0;background:#f2f4f7;font-family:Inter,system-ui,Arial;color:#0b1622}
.app{max-width:520px;margin:0 auto;background:#f7f8fb;min-height:100vh;padding-bottom:92px}
.topbar{position:sticky;top:0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);z-index:10;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e6e8ee}
.logo{display:flex;gap:10px;align-items:center}
.logo span,.postHead small{display:block;color:#6b7280;font-size:12px}
.mark,.avatar{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:#0b1622;color:#e8c96d;font-weight:800}
.icons{display:flex;gap:8px}
.icons button,.actions button,nav button{border:0;background:white;border-radius:999px;padding:9px 11px;font-weight:700}
main{padding:14px}
.goal{background:linear-gradient(135deg,#0b1622,#112033);color:white;border-radius:26px;padding:20px;box-shadow:0 12px 30px rgba(0,0,0,.12)}
.goal small{color:#e8c96d;font-weight:800}
.goal h1{margin:6px 0;font-size:31px}
.ring{float:right;margin-top:-56px;border:3px solid #e8c96d;border-radius:50%;width:76px;height:76px;display:grid;place-items:center;font-size:12px;font-weight:900}
.bar{height:10px;background:rgba(255,255,255,.15);border-radius:999px;overflow:hidden;margin:14px 0}
.bar span{display:block;height:100%;background:#e8c96d}
.miniStats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}
.miniStats div{background:rgba(255,255,255,.1);border-radius:16px;padding:11px;text-align:center}
.miniStats b{display:block;font-size:18px}
.miniStats span{font-size:11px;color:#d7dde8}
.celebrate,.missionMoney{margin-top:12px;background:#fff8df;color:#614700;border-radius:16px;padding:12px;font-weight:800}
.stories{display:flex;gap:12px;overflow:auto;margin:16px 0;padding-bottom:4px}
.story{min-width:92px}
.storyImg{height:126px;border-radius:20px;color:white;font-size:24px;display:grid;place-items:center;background:#12365f}
.s1{background:linear-gradient(135deg,#c9a84c,#0b1622)}.s2{background:linear-gradient(135deg,#2ecc8a,#112033)}.s3{background:linear-gradient(135deg,#4a8fd9,#0b1622)}.s4{background:linear-gradient(135deg,#e85c5c,#112033)}
.story span{font-size:12px;font-weight:800;display:block;margin-top:6px}
.composer,.daily,.post,.person,.group,.event,.prayer,.profile,.tier,.cityInvasion{background:white;border-radius:22px;padding:16px;margin:14px 0;box-shadow:0 8px 22px rgba(10,30,60,.06)}
.composer{display:flex;gap:10px;align-items:center;color:#6b7280}
.daily button, .person button,.group button,.event button,.cityInvasion button,.prayer button,.tier button,.sheet button,.reset{border:0;border-radius:14px;padding:12px 14px;background:#0b1622;color:white;font-weight:800;margin:6px 6px 0 0}
.postHead{display:flex;gap:10px;align-items:center}
.image{height:230px;border-radius:18px;margin:12px 0;display:grid;place-items:center;color:white;font-weight:900;font-size:22px;text-align:center;padding:20px}
.souls{background:#eafaf2;color:#086b3d;border-radius:12px;padding:10px;font-weight:800}
.actions{display:flex;justify-content:space-between;margin-top:10px;gap:6px}
.actions button{background:#f1f3f6;color:#111;padding:9px;font-size:12px}
.cards{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.person,.group{margin:0}
.groupBanner{height:80px;border-radius:18px;background:linear-gradient(135deg,#0b1622,#c9a84c);display:grid;place-items:center;font-size:32px}
.reels{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.reel{height:260px;border-radius:24px;color:white;padding:16px;display:flex;flex-direction:column;justify-content:flex-end;background:linear-gradient(135deg,#0b1622,#c9a84c)}
.r1{background:linear-gradient(135deg,#12365f,#2ecc8a)}.r2{background:linear-gradient(135deg,#4a8fd9,#0b1622)}.r3{background:linear-gradient(135deg,#e85c5c,#112033)}
.play{font-size:38px;margin-bottom:auto}
.tiers{display:grid;gap:10px}
.tier.selected{border:2px solid #c9a84c}
.profile{text-align:center}
.big{width:72px;height:72px;margin:0 auto 8px}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:30;display:flex;align-items:flex-end}
.sheet{background:white;width:100%;max-width:520px;margin:0 auto;border-radius:28px 28px 0 0;padding:22px}
.close{float:right;background:#eee!important;color:#111!important;border-radius:50%!important}
select,textarea,input{width:100%;border:1px solid #d9dee8;border-radius:14px;padding:13px;margin:7px 0;font-size:15px}
textarea{min-height:130px}
nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);max-width:520px;width:100%;background:white;border-top:1px solid #e6e8ee;display:flex;justify-content:space-around;padding:8px 4px;z-index:20}
nav button{background:transparent;color:#6b7280;padding:6px}
nav button span{display:block;font-size:19px}
nav button small{font-size:10px}
nav button.on{color:#0b63ce}
.muted{color:#6b7280}
h2{margin-top:8px}
`;