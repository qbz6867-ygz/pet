"use client";

import { useMemo, useState } from "react";

type Tab = "home" | "records" | "wiki" | "profile";

const pets = [
  { name: "旺财", type: "柯基犬", age: "2岁 4个月", emoji: "🐕", tone: "gold" },
  { name: "糯米", type: "英短猫", age: "1岁 8个月", emoji: "🐈", tone: "blue" },
];

const initialTasks = [
  { id: 1, time: "08:30", title: "早餐喂食", note: "犬粮 80g", done: true, icon: "🥣" },
  { id: 2, time: "12:30", title: "午间遛弯", note: "建议 30 分钟", done: false, icon: "🦮" },
  { id: 3, time: "19:00", title: "清洁梳毛", note: "检查皮肤状态", done: false, icon: "🪮" },
];

const healthItems = [
  { label: "食量", value: "80", unit: "g", icon: "🥣" },
  { label: "饮水", value: "520", unit: "ml", icon: "💧" },
  { label: "遛弯", value: "48", unit: "分钟", icon: "🦮" },
  { label: "排便", value: "正常", unit: "", icon: "💩" },
  { label: "体重", value: "10.8", unit: "kg", icon: "⚖️" },
  { label: "精神", value: "活跃", unit: "", icon: "✨" },
];

const breeds = [
  { name: "威尔士柯基犬", type: "犬类", trait: "活泼 · 亲人", age: "12–15 年", emoji: "🐕" },
  { name: "英国短毛猫", type: "猫类", trait: "温和 · 安静", age: "14–18 年", emoji: "🐈" },
  { name: "金毛寻回犬", type: "犬类", trait: "友善 · 聪明", age: "10–12 年", emoji: "🦮" },
  { name: "布偶猫", type: "猫类", trait: "温顺 · 粘人", age: "13–16 年", emoji: "🐱" },
];

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">PAW DAILY</p>
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
      <button className="icon-button" aria-label="消息提醒">
        <span>🔔</span>
        <i />
      </button>
    </header>
  );
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [petIndex, setPetIndex] = useState(0);
  const [checkInOpen, setCheckInOpen] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [taskModal, setTaskModal] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [filter, setFilter] = useState("全部");
  const [query, setQuery] = useState("");
  const pet = pets[petIndex];

  const filteredBreeds = useMemo(
    () =>
      breeds.filter(
        (breed) =>
          (filter === "全部" || breed.type === filter) &&
          breed.name.includes(query.trim()),
      ),
    [filter, query],
  );

  const completeTask = (id: number) => {
    setTasks((items) => items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  return (
    <main className="shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className="app-frame" aria-label="宠物健康助手">
        <div className="status-bar">
          <span>9:41</span>
          <span>● ● ▰</span>
        </div>

        <div className="app-content">
          {tab === "home" && (
            <>
              <Header title="早上好，林安" subtitle="和毛孩子一起开启元气满满的一天" />

              <section className={`pet-card ${pet.tone}`}>
                <div className="pet-art" aria-hidden="true">
                  <span>{pet.emoji}</span>
                  <b>♥</b>
                </div>
                <div className="pet-copy">
                  <div className="pet-title-row">
                    <div>
                      <p>我的伙伴</p>
                      <h2>{pet.name}</h2>
                    </div>
                    <button className="round-action" aria-label="管理宠物">•••</button>
                  </div>
                  <p>{pet.type} · {pet.age}</p>
                  <div className="pet-meta">
                    <span>♂ 男孩</span>
                    <span>10.8 kg</span>
                  </div>
                </div>
                <div className="pet-switch" aria-label="切换宠物">
                  {pets.map((item, index) => (
                    <button
                      key={item.name}
                      className={index === petIndex ? "active" : ""}
                      onClick={() => setPetIndex(index)}
                      aria-label={`切换到${item.name}`}
                    />
                  ))}
                </div>
              </section>

              <section className={`checkin-card ${checkedIn ? "is-done" : ""}`}>
                <button className="section-toggle" onClick={() => setCheckInOpen(!checkInOpen)}>
                  <span className="section-icon">✚</span>
                  <span>
                    <small>今日健康打卡</small>
                    <strong>{checkedIn ? "今天记录得很棒！" : "还差一步，完成今日记录"}</strong>
                  </span>
                  <em>{checkInOpen ? "⌃" : "⌄"}</em>
                </button>
                {checkInOpen && (
                  <div className="checkin-body">
                    <div className="health-grid">
                      {healthItems.map((item) => (
                        <button key={item.label} className="health-item">
                          <span>{item.icon}</span>
                          <small>{item.label}</small>
                          <strong>{item.value}<i>{item.unit}</i></strong>
                        </button>
                      ))}
                    </div>
                    <button className="primary-button" onClick={() => setCheckedIn(true)}>
                      {checkedIn ? "已完成今日打卡 ✓" : "完成今日打卡"}
                    </button>
                  </div>
                )}
              </section>

              <section className="tasks-section">
                <div className="section-heading">
                  <div>
                    <p>今日安排</p>
                    <h2>宠物任务</h2>
                  </div>
                  <span>{tasks.filter((task) => task.done).length}/{tasks.length} 已完成</span>
                </div>
                <div className="task-list">
                  {tasks.map((task) => (
                    <article className={`task ${task.done ? "done" : ""}`} key={task.id}>
                      <time>{task.time}</time>
                      <span className="task-emoji">{task.icon}</span>
                      <div>
                        <h3>{task.title}</h3>
                        <p>{task.note}</p>
                      </div>
                      <button onClick={() => completeTask(task.id)} aria-label={`${task.title}标记完成`}>
                        {task.done ? "✓" : ""}
                      </button>
                    </article>
                  ))}
                  <button className="add-task" onClick={() => setTaskModal(true)}>
                    <span>＋</span> 新增宠物任务
                  </button>
                </div>
              </section>
            </>
          )}

          {tab === "records" && (
            <>
              <Header title="健康记录" subtitle={`${pet.name}最近状态平稳，继续保持`} />
              <button className="date-select" onClick={() => setCalendarOpen(!calendarOpen)}>
                <span>‹</span><strong>2026 年 7 月</strong><span>›</span>
              </button>
              {calendarOpen && (
                <div className="calendar-popover">
                  <strong>选择日期</strong>
                  <div>{["一", "二", "三", "四", "五", "六", "日"].map((d) => <span key={d}>{d}</span>)}</div>
                  <div>{[21, 22, 23, 24, 25, 26, 27].map((d) => <button className={d === 27 ? "selected" : ""} key={d}>{d}</button>)}</div>
                </div>
              )}
              <div className="week-strip">
                {["周一 21", "周二 22", "周三 23", "周四 24", "周五 25", "周六 26", "今天 27"].map((day, i) => {
                  const [week, date] = day.split(" ");
                  return <button className={i === 6 ? "active" : ""} key={day}><small>{week}</small><strong>{date}</strong><i /></button>;
                })}
              </div>
              <section className="score-card">
                <div className="score-ring"><strong>92</strong><small>健康值</small></div>
                <div>
                  <p>今日健康状态</p>
                  <h2>状态优秀</h2>
                  <span>较上周提升 4 分 ↗</span>
                </div>
              </section>
              <section className="chart-card">
                <div className="section-heading compact">
                  <div><p>趋势分析</p><h2>近 7 日健康值</h2></div>
                  <span>平均 88 分</span>
                </div>
                <div className="chart">
                  {[74, 82, 79, 91, 87, 85, 92].map((height, index) => (
                    <div key={index}><i style={{ height: `${height}%` }} /><span>{index + 21}</span></div>
                  ))}
                </div>
              </section>
              <section className="record-summary">
                <div className="section-heading compact"><div><p>当日明细</p><h2>健康记录</h2></div><button>查看详情 ›</button></div>
                <div className="summary-grid">
                  {healthItems.map((item) => <div key={item.label}><span>{item.icon}</span><small>{item.label}</small><strong>{item.value} {item.unit}</strong></div>)}
                </div>
              </section>
              <aside className="tip-card"><span>💡</span><p><strong>健康建议</strong>旺财今天饮水充足，运动量良好。建议晚间散步后轻柔梳毛。</p></aside>
            </>
          )}

          {tab === "wiki" && (
            <>
              <Header title="宠物百科" subtitle="了解它，是更好陪伴的开始" />
              <label className="search-box">
                <span>⌕</span>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索宠物品种" />
                {query && <button onClick={() => setQuery("")}>×</button>}
              </label>
              <div className="filters">
                {["全部", "犬类", "猫类"].map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}
              </div>
              <section className="featured-breed">
                <div><small>今日推荐</small><h2>柯基犬的快乐秘诀</h2><p>每天适量运动、科学饮食与足够陪伴。</p><button>阅读养护指南 →</button></div>
                <span>🐕</span>
              </section>
              <div className="section-heading compact"><div><p>为你推荐</p><h2>热门品种</h2></div><span>{filteredBreeds.length} 个结果</span></div>
              <section className="breed-grid">
                {filteredBreeds.map((breed) => (
                  <article key={breed.name}>
                    <div className="breed-art"><span>{breed.emoji}</span><small>{breed.type}</small></div>
                    <h3>{breed.name}</h3>
                    <p>{breed.trait}</p>
                    <footer><span>平均寿命</span><strong>{breed.age}</strong></footer>
                  </article>
                ))}
              </section>
              {!filteredBreeds.length && <div className="empty-state"><span>🐾</span><p>没有找到相关品种</p></div>}
            </>
          )}

          {tab === "profile" && (
            <>
              <Header title="我的" />
              <section className="profile-card">
                <div className="avatar">林</div>
                <div><small>铲屎官</small><h2>林安</h2><p>陪伴毛孩子的第 826 天</p></div>
                <button>›</button>
              </section>
              <section className="family-card">
                <div className="section-heading compact"><div><p>一起照顾</p><h2>家庭组</h2></div><button>管理 ›</button></div>
                <div className="family-members">
                  <span className="member coral">林</span><span className="member teal">陈</span><span className="member purple">周</span><button>＋</button>
                </div>
                <p>3 位家庭成员 · 共同照顾 2 只宠物</p>
              </section>
              <section className="menu-list">
                {[
                  ["🐾", "宠物管理", "2 只宠物"],
                  ["🔔", "消息提醒", "2 条未读"],
                  ["⚙️", "系统设置", ""],
                  ["❓", "帮助与反馈", ""],
                ].map((item) => <button key={item[1]}><span>{item[0]}</span><strong>{item[1]}</strong><small>{item[2]}</small><i>›</i></button>)}
              </section>
              <p className="version">宠物健康助手 · v1.0.0</p>
            </>
          )}
        </div>

        <nav className="tab-bar">
          {([
            ["home", "⌂", "首页"],
            ["records", "▥", "记录"],
            ["wiki", "◎", "百科"],
            ["profile", "♙", "我的"],
          ] as [Tab, string, string][]).map(([key, icon, label]) => (
            <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
              <span>{icon}</span><small>{label}</small>
            </button>
          ))}
        </nav>
      </section>

      {taskModal && (
        <div className="modal-backdrop" onMouseDown={() => setTaskModal(false)}>
          <section className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="section-heading compact"><div><p>创建安排</p><h2>新增宠物任务</h2></div><button onClick={() => setTaskModal(false)}>×</button></div>
            <label>任务类型<select><option>喂食</option><option>遛弯</option><option>洗澡</option><option>驱虫</option><option>剪指甲</option></select></label>
            <label>执行时间<input type="time" defaultValue="18:30" /></label>
            <label>任务备注<input placeholder="例如：晚餐犬粮 80g" /></label>
            <button className="primary-button" onClick={() => {
              setTasks((items) => [...items, { id: Date.now(), time: "18:30", title: "晚餐喂食", note: "犬粮 80g", done: false, icon: "🥣" }]);
              setTaskModal(false);
            }}>保存任务</button>
          </section>
        </div>
      )}
    </main>
  );
}
