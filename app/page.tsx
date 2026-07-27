"use client";

import {
  Activity,
  ArrowLeft,
  Bell,
  Bone,
  BookOpen,
  Cake,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Droplets,
  Footprints,
  Gauge,
  HeartPulse,
  House,
  ListFilter,
  LockKeyhole,
  LogOut,
  MapPin,
  MessageCircle,
  PawPrint,
  Pencil,
  Plus,
  Ruler,
  Scale,
  Scissors,
  Settings,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Syringe,
  Toilet,
  Trash2,
  Utensils,
  UserRound,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

type Tab = "home" | "records" | "wiki" | "profile";

const initialPets = [
  { name: "旺财", type: "柯基犬", age: "2岁 4个月", emoji: "🐕", tone: "gold", avatar: "/pet-avatar-corgi.png" },
  { name: "糯米", type: "英短猫", age: "1岁 8个月", emoji: "🐈", tone: "blue" },
];

const initialPetProfiles = [
  { gender: "男孩", birthday: "2024-03-18", weight: "10.8", arrival: "2024-07-06" },
  { gender: "女孩", birthday: "2024-11-12", weight: "4.6", arrival: "2025-02-16" },
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

type PetRecordData = {
  score: number;
  status: string;
  change: number;
  chart: number[];
  health: Record<string, { value: string; unit: string }>;
  tip: string;
};

const initialPetRecordData: PetRecordData[] = [
  {
    score: 92,
    status: "优秀",
    change: 4,
    chart: [74, 82, 79, 91, 87, 85, 92],
    health: {
      食量: { value: "80", unit: "g" },
      饮水: { value: "520", unit: "ml" },
      遛弯: { value: "48", unit: "分钟" },
      排便: { value: "正常", unit: "" },
      体重: { value: "10.8", unit: "kg" },
      精神: { value: "活跃", unit: "" },
    },
    tip: "旺财今天饮水充足，运动量良好。建议晚间散步后轻柔梳毛。",
  },
  {
    score: 86,
    status: "良好",
    change: 1,
    chart: [80, 83, 85, 82, 88, 84, 86],
    health: {
      食量: { value: "65", unit: "g" },
      饮水: { value: "310", unit: "ml" },
      遛弯: { value: "28", unit: "分钟" },
      排便: { value: "正常", unit: "" },
      体重: { value: "4.6", unit: "kg" },
      精神: { value: "安静", unit: "" },
    },
    tip: "糯米今天状态平稳，饮水量稍低。建议增加湿粮或在常活动区域补充水碗。",
  },
];

const createDefaultPetRecord = (): PetRecordData => ({
  score: 78,
  status: "待观察",
  change: 0,
  chart: [76, 78, 77, 79, 80, 78, 78],
  health: {
    食量: { value: "--", unit: "g" },
    饮水: { value: "--", unit: "ml" },
    遛弯: { value: "--", unit: "分钟" },
    排便: { value: "待记录", unit: "" },
    体重: { value: "--", unit: "kg" },
    精神: { value: "待记录", unit: "" },
  },
  tip: "新宠物的健康数据尚未完善，完成首次健康打卡后将生成专属建议。",
});

const homeHealthIcons: Record<string, LucideIcon> = {
  食量: Utensils,
  饮水: Droplets,
  遛弯: Footprints,
  排便: Toilet,
  体重: Gauge,
  精神: Sparkles,
};

type AppMessage = {
  id: number;
  title: string;
  body: string;
  time: string;
  category: string;
  unread: boolean;
  icon: LucideIcon;
};

const initialMessages: AppMessage[] = [
  {
    id: 1,
    title: "今日健康打卡还未完成",
    body: "旺财还有 1 项健康记录待确认，完成后可生成今日健康小结。",
    time: "10 分钟前",
    category: "健康提醒",
    unread: true,
    icon: HeartPulse,
  },
  {
    id: 2,
    title: "午间遛弯即将开始",
    body: "计划时间为 12:30，建议携带饮水并避开正午高温路段。",
    time: "今天 10:20",
    category: "任务提醒",
    unread: true,
    icon: Footprints,
  },
  {
    id: 3,
    title: "驱虫记录已更新",
    body: "旺财本月体内外驱虫已完成，下次建议日期为 2026.08.08。",
    time: "昨天 18:42",
    category: "健康档案",
    unread: false,
    icon: ShieldCheck,
  },
  {
    id: 4,
    title: "本周饮食状态稳定",
    body: "近 7 天平均进食量处于正常范围，请继续保持规律喂养。",
    time: "7 月 26 日",
    category: "每周小结",
    unread: false,
    icon: Utensils,
  },
];

type Breed = {
  name: string;
  type: "犬类" | "猫类";
  trait: string;
  age: string;
  emoji: string;
  size: string;
  exercise: string;
  shedding: string;
  appetite: string;
  odor: string;
  intro: string;
  care: string;
};

const breeds: Breed[] = [
  {
    name: "威尔士柯基犬", type: "犬类", trait: "活泼 · 亲人", age: "12–15 年", emoji: "🐕",
    size: "小型犬", exercise: "中高", shedding: "较多", appetite: "中等", odor: "较轻",
    intro: "短腿、大耳朵和灿烂笑容是它的标志。性格开朗，喜欢参与家庭活动，也很愿意和人互动。",
    care: "每天安排 45–60 分钟散步，控制体重并减少频繁上下楼，换毛期需要增加梳毛频率。",
  },
  {
    name: "英国短毛猫", type: "猫类", trait: "温和 · 安静", age: "14–18 年", emoji: "🐈",
    size: "中型猫", exercise: "中低", shedding: "中等", appetite: "较好", odor: "很轻",
    intro: "圆脸、厚实被毛和沉稳气质很有辨识度。适应力强，独处时安静，也乐于陪伴家人。",
    care: "每周梳毛 2–3 次，准备益智玩具鼓励活动，并关注饮食热量与体重变化。",
  },
  {
    name: "金毛寻回犬", type: "犬类", trait: "友善 · 聪明", age: "10–12 年", emoji: "🦮",
    size: "大型犬", exercise: "高", shedding: "较多", appetite: "较大", odor: "中等",
    intro: "性格温和、学习能力强，对儿童和其他宠物通常十分友善，是热情可靠的家庭伙伴。",
    care: "每天保证 60–90 分钟运动，定期清洁耳道并梳理长毛，训练时适合使用正向奖励。",
  },
  {
    name: "布偶猫", type: "猫类", trait: "温顺 · 粘人", age: "13–16 年", emoji: "🐱",
    size: "大型猫", exercise: "中低", shedding: "较多", appetite: "中等", odor: "很轻",
    intro: "拥有蓝色眼睛和柔软长毛，性格温柔且依恋家人，喜欢在熟悉的人身边安静陪伴。",
    care: "每周梳毛 3–4 次以减少打结，设置低强度互动游戏，并注意饮水量与口腔护理。",
  },
  {
    name: "柴犬", type: "犬类", trait: "独立 · 忠诚", age: "12–15 年", emoji: "🐕",
    size: "中小型犬", exercise: "中高", shedding: "较多", appetite: "中等", odor: "较轻",
    intro: "警觉、利落又很有主见，对家人忠诚。早期社会化能帮助它更从容地面对陌生环境。",
    care: "保持规律运动和边界清晰的训练，换毛季每天梳毛，并使用牵引绳保障户外安全。",
  },
  {
    name: "贵宾犬", type: "犬类", trait: "聪明 · 活跃", age: "12–15 年", emoji: "🐩",
    size: "小至中型犬", exercise: "中高", shedding: "很少", appetite: "中等", odor: "较轻",
    intro: "反应敏捷、学习速度快，喜欢互动和挑战。卷曲被毛掉毛少，但需要持续美容维护。",
    care: "每 4–6 周修剪被毛，搭配散步与益智训练，日常留意耳道、牙齿和泪痕清洁。",
  },
  {
    name: "暹罗猫", type: "猫类", trait: "亲人 · 爱交流", age: "12–16 年", emoji: "🐈",
    size: "中型猫", exercise: "中高", shedding: "较少", appetite: "中等", odor: "很轻",
    intro: "身形修长、重点色明显，喜欢用声音表达需求。它重视陪伴，也热衷探索与互动。",
    care: "每天安排逗猫和攀爬活动，避免长时间独处，并定期检查牙齿与保持稳定作息。",
  },
  {
    name: "缅因猫", type: "猫类", trait: "温柔 · 稳重", age: "12–15 年", emoji: "🐱",
    size: "大型猫", exercise: "中等", shedding: "较多", appetite: "较大", odor: "很轻",
    intro: "体格高大、长毛蓬松，却有温柔沉稳的性格。善于与家庭成员相处，也保留探索欲。",
    care: "每周至少梳毛 3 次，提供结实的猫爬架，控制体重并关注关节和心脏健康。",
  },
];

function Header({
  title,
  subtitle,
  showPetManagement = false,
  action = "notification",
  onAction,
}: {
  title: string;
  subtitle?: string;
  showPetManagement?: boolean;
  action?: "notification" | "calendar";
  onAction?: () => void;
}) {
  if (!showPetManagement) {
    return (
      <header className="page-header">
        <div>
          <p className="eyebrow">PAW DAILY</p>
          <h1>{title}</h1>
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
        <button
          className="icon-button"
          aria-label={action === "calendar" ? "打开日历" : "消息提醒"}
          onClick={onAction}
        >
          {action === "calendar" ? (
            <CalendarDays size={19} strokeWidth={1.8} aria-hidden="true" />
          ) : (
            <>
              <span>🔔</span>
              <i />
            </>
          )}
        </button>
      </header>
    );
  }

  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">PAW DAILY</p>
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
      <div className="header-actions">
        <button className="icon-button pet-management-button" aria-label="宠物管理">
          <PawPrint size={19} strokeWidth={1.8} aria-hidden="true" />
        </button>
        <button className="icon-button" aria-label="消息提醒">
          <Bell size={19} strokeWidth={1.8} aria-hidden="true" />
          <i />
        </button>
      </div>
    </header>
  );
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [petIndex, setPetIndex] = useState(0);
  const [checkInOpen, setCheckInOpen] = useState(true);
  const [checkedInPets, setCheckedInPets] = useState<string[]>([]);
  const [tasks, setTasks] = useState(initialTasks);
  const [taskModal, setTaskModal] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [recordPetPickerOpen, setRecordPetPickerOpen] = useState(false);
  const [recordDate, setRecordDate] = useState(new Date(2026, 6, 27));
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 6, 1));
  const [filter, setFilter] = useState("全部");
  const [wikiFilterOpen, setWikiFilterOpen] = useState(false);
  const [wikiAllOpen, setWikiAllOpen] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
  const [query, setQuery] = useState("");
  const [petProfileOpen, setPetProfileOpen] = useState(false);
  const [petProfileSource, setPetProfileSource] = useState<"home" | "management">("home");
  const [petManagementOpen, setPetManagementOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [profileInfoOpen, setProfileInfoOpen] = useState(false);
  const [familyGroupOpen, setFamilyGroupOpen] = useState(false);
  const [profilePanel, setProfilePanel] = useState<"settings" | "help" | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [appSettings, setAppSettings] = useState({
    taskReminders: true,
  });
  const [personalEditorOpen, setPersonalEditorOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [addPetOpen, setAddPetOpen] = useState(false);
  const [profileEditorOpen, setProfileEditorOpen] = useState(false);
  const [deletePetOpen, setDeletePetOpen] = useState(false);
  const [petList, setPetList] = useState(initialPets);
  const [petProfiles, setPetProfiles] = useState(initialPetProfiles);
  const [petRecords, setPetRecords] = useState(initialPetRecordData);
  const [profileDraft, setProfileDraft] = useState(initialPetProfiles[0]);
  const [accountProfile, setAccountProfile] = useState({
    name: "林安",
    phone: "138 **** 2608",
    city: "浙江 · 杭州",
    bio: "喜欢散步、拍照，也喜欢把旺财和糯米的健康变化记录下来。希望每一只毛孩子都被温柔照顾。",
  });
  const [accountDraft, setAccountDraft] = useState({
    name: "林安",
    phone: "138 **** 2608",
    city: "浙江 · 杭州",
    bio: "喜欢散步、拍照，也喜欢把旺财和糯米的健康变化记录下来。希望每一只毛孩子都被温柔照顾。",
  });
  const [newPetDraft, setNewPetDraft] = useState({
    name: "",
    species: "狗狗",
    breed: "",
    age: "",
    gender: "男孩",
  });
  const pet = petList[petIndex];
  const checkedIn = checkedInPets.includes(pet.name);
  const petProfile = petProfiles[petIndex];
  const petRecord = petRecords[petIndex] ?? initialPetRecordData[0];
  const unreadMessageCount = messages.filter((message) => message.unread).length;
  const calendarYear = calendarMonth.getFullYear();
  const calendarMonthIndex = calendarMonth.getMonth();
  const calendarLeadingDays = (new Date(calendarYear, calendarMonthIndex, 1).getDay() + 6) % 7;
  const calendarDayCount = new Date(calendarYear, calendarMonthIndex + 1, 0).getDate();
  const calendarCells = [
    ...Array.from({ length: calendarLeadingDays }, () => null),
    ...Array.from({ length: calendarDayCount }, (_, index) => index + 1),
  ];
  const recordWeekDates = useMemo(() => {
    const mondayOffset = (recordDate.getDay() + 6) % 7;
    const monday = new Date(recordDate);
    monday.setDate(recordDate.getDate() - mondayOffset);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  }, [recordDate]);
  const chartValues = petRecord.chart;
  const recordHealthItems = healthItems.map((item) => ({
    ...item,
    ...(petRecord.health[item.label] ?? {}),
  }));
  const averageHealthScore = Math.round(chartValues.reduce((sum, value) => sum + value, 0) / chartValues.length);
  const chartPoints = chartValues
    .map((value, index) => `${18 + index * 44},${110 - (value - 70) * 3}`)
    .join(" ");

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
    <main className={`shell ${tab === "home" ? "home-shell" : ""}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className="app-frame" aria-label="宠物健康助手">
        <div className="status-bar">
          <span>9:41</span>
          <span>● ● ▰</span>
        </div>

        <div className="app-content">
          {tab === "home" && !petProfileOpen && !petManagementOpen && !messagesOpen && (
            <div className="home-view">
              <section className={`pet-card ${pet.tone}`}>
                <div className="pet-card-actions">
                  <button
                    className="icon-button pet-management-button"
                    aria-label="宠物管理"
                    onClick={() => setPetManagementOpen(true)}
                  >
                    <PawPrint size={19} strokeWidth={1.8} aria-hidden="true" />
                  </button>
                  <button
                    className="icon-button"
                    aria-label="消息提醒"
                    onClick={() => setMessagesOpen(true)}
                  >
                    <Bell size={19} strokeWidth={1.8} aria-hidden="true" />
                    {unreadMessageCount > 0 && <i />}
                  </button>
                </div>
                <button
                  className="pet-art"
                  type="button"
                  onClick={() => {
                    setPetProfileSource("home");
                    setPetProfileOpen(true);
                  }}
                  aria-label={`查看${pet.name}的宠物档案`}
                >
                  {"avatar" in pet ? (
                    <img src={pet.avatar} alt={`${pet.name}的宠物头像`} />
                  ) : (
                    <span aria-hidden="true">{pet.emoji}</span>
                  )}
                </button>
                <div className="pet-copy">
                  <div className="pet-title-row">
                    <div>
                      <p>我的伙伴</p>
                      <h2>{pet.name}</h2>
                    </div>
                  </div>
                  <p>{pet.type} · {pet.age}</p>
                </div>
                <div className="pet-switch" aria-label="切换宠物">
                  {petList.map((item, index) => (
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
                  <span className="section-copy">
                    <small>今日健康打卡</small>
                    <strong>{checkedIn ? "今天记录得很棒！" : "还差一步，完成今日记录"}</strong>
                  </span>
                  <span className="checkin-toggle-actions">
                    {checkedIn && (
                      <span className="checkin-complete-badge">
                        已完成
                        <Check size={12} strokeWidth={2.2} aria-hidden="true" />
                      </span>
                    )}
                    <em>{checkInOpen ? "⌃" : "⌄"}</em>
                  </span>
                </button>
                {checkInOpen && (
                  <div className="checkin-body">
                    <div className="health-grid">
                      {healthItems.map((item) => {
                        const HealthIcon = homeHealthIcons[item.label];
                        return (
                          <button key={item.label} className="health-item">
                            <span className="health-line-icon" aria-hidden="true">
                              <HealthIcon size={19} strokeWidth={1.8} />
                            </span>
                            <small>{item.label}</small>
                            <strong>{item.value}<i>{item.unit}</i></strong>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      className="primary-button"
                      onClick={() =>
                        setCheckedInPets((names) => names.includes(pet.name) ? names : [...names, pet.name])
                      }
                    >
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
            </div>
          )}

          {messagesOpen && (
            <div className="messages-view">
              <header className="pet-profile-header">
                <button type="button" onClick={() => setMessagesOpen(false)} aria-label="返回上一级">
                  <ArrowLeft size={20} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <div>
                  <small>消息提醒</small>
                  <h1>消息中心</h1>
                </div>
              </header>

              <section className="message-list" aria-label="消息列表">
                {messages.map((message) => {
                  const MessageIcon = message.icon;
                  return (
                    <button
                      type="button"
                      className={`message-card ${message.unread ? "unread" : ""}`}
                      key={message.id}
                      onClick={() =>
                        setMessages((items) =>
                          items.map((item) => item.id === message.id ? { ...item, unread: false } : item),
                        )
                      }
                    >
                      <span className="message-icon">
                        <MessageIcon size={19} strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <span className="message-copy">
                        <span><small>{message.category}</small><time>{message.time}</time></span>
                        <strong>{message.title}</strong>
                        <em>{message.body}</em>
                      </span>
                      {message.unread && <i aria-label="未读" />}
                    </button>
                  );
                })}
              </section>
            </div>
          )}

          {petManagementOpen && (
            <div className="pet-management-view">
              <header className="pet-profile-header">
                <button type="button" onClick={() => setPetManagementOpen(false)} aria-label="返回首页">
                  <ArrowLeft size={20} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <div>
                  <small>我的伙伴</small>
                  <h1>宠物管理</h1>
                </div>
              </header>

              <div className="management-summary">
                <div>
                  <small>家庭宠物</small>
                  <h2>{petList.length} 位毛孩子</h2>
                </div>
                <PawPrint size={22} strokeWidth={1.8} aria-hidden="true" />
              </div>

              <section className="management-pet-list" aria-label="现有宠物">
                {petList.map((item, index) => (
                  <button
                    type="button"
                    className={`management-pet-card ${item.tone}`}
                    key={item.name}
                    onClick={() => {
                      setPetIndex(index);
                      setPetProfileSource("management");
                      setPetManagementOpen(false);
                      setPetProfileOpen(true);
                    }}
                    aria-label={`查看${item.name}的宠物档案`}
                  >
                    <span className="management-pet-avatar">
                      {"avatar" in item ? (
                        <img src={item.avatar} alt="" />
                      ) : (
                        <em aria-hidden="true">{item.emoji}</em>
                      )}
                    </span>
                    <span className="management-pet-copy">
                      <small>{index === petIndex ? "当前宠物" : "家庭成员"}</small>
                      <strong>{item.name}</strong>
                      <em>{item.type} · {item.age}</em>
                    </span>
                    {index === petIndex && <span className="current-pet-tag">当前</span>}
                    <ChevronRight size={18} strokeWidth={1.8} aria-hidden="true" />
                  </button>
                ))}

                <button
                  type="button"
                  className="add-pet-card"
                  onClick={() => setAddPetOpen(true)}
                >
                  <span><Plus size={21} strokeWidth={1.8} aria-hidden="true" /></span>
                  <strong>添加宠物</strong>
                  <small>创建新的宠物档案</small>
                </button>
              </section>
            </div>
          )}

          {petProfileOpen && (
            <div className="pet-profile-view">
              <header className="pet-profile-header">
                <button
                  type="button"
                  onClick={() => {
                    setPetProfileOpen(false);
                    if (petProfileSource === "management") {
                      setPetManagementOpen(true);
                    }
                  }}
                  aria-label={petProfileSource === "management" ? "返回宠物管理" : "返回首页"}
                >
                  <ArrowLeft size={20} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <div>
                  <small>宠物档案</small>
                  <h1>档案详情</h1>
                </div>
              </header>

              <section className="pet-profile-hero">
                <div className="profile-pet-avatar">
                  {"avatar" in pet ? (
                    <img src={pet.avatar} alt={`${pet.name}的宠物头像`} />
                  ) : (
                    <span aria-hidden="true">{pet.emoji}</span>
                  )}
                </div>
                <div>
                  <small>我的伙伴</small>
                  <h2>{pet.name}</h2>
                  <p>{pet.type} · {pet.age}</p>
                </div>
              </section>

              <section className="archive-card">
                <div className="archive-title">
                  <div>
                    <small>身份信息</small>
                    <h2>基本档案</h2>
                  </div>
                  <button
                    type="button"
                    className="archive-edit-button"
                    onClick={() => {
                      setProfileDraft(petProfile);
                      setProfileEditorOpen(true);
                    }}
                  >
                    <Pencil size={14} strokeWidth={1.8} aria-hidden="true" />
                    编辑信息
                  </button>
                </div>
                <div className="archive-grid">
                  <div>
                    <span><UserRound size={17} strokeWidth={1.8} /></span>
                    <small>性别</small>
                    <strong>{petProfile.gender}</strong>
                  </div>
                  <div>
                    <span><Cake size={17} strokeWidth={1.8} /></span>
                    <small>出生日期</small>
                    <strong>{petProfile.birthday.replaceAll("-", ".")}</strong>
                  </div>
                  <div>
                    <span><Scale size={17} strokeWidth={1.8} /></span>
                    <small>当前体重</small>
                    <strong>{petProfile.weight} kg</strong>
                  </div>
                  <div>
                    <span><CalendarDays size={17} strokeWidth={1.8} /></span>
                    <small>到家日期</small>
                    <strong>{petProfile.arrival.replaceAll("-", ".")}</strong>
                  </div>
                </div>
              </section>

              <section className="archive-card health-archive">
                <div className="archive-title">
                  <div>
                    <small>健康管理</small>
                    <h2>健康档案</h2>
                  </div>
                  <HeartPulse size={20} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className="archive-list">
                  <div>
                    <span><Syringe size={18} strokeWidth={1.8} /></span>
                    <p><strong>疫苗接种</strong><small>狂犬疫苗有效期至 2027.05</small></p>
                    <em>已完成</em>
                  </div>
                  <div>
                    <span><ShieldCheck size={18} strokeWidth={1.8} /></span>
                    <p><strong>体内外驱虫</strong><small>最近一次 2026.07.08</small></p>
                    <em>正常</em>
                  </div>
                  <div>
                    <span><HeartPulse size={18} strokeWidth={1.8} /></span>
                    <p><strong>健康状态</strong><small>暂无过敏与慢性病记录</small></p>
                    <em>良好</em>
                  </div>
                </div>
              </section>

              <section className="personality-card">
                <small>性格档案</small>
                <h2>活泼、亲人、喜欢玩球</h2>
                <p>最喜欢傍晚散步，听到零食袋的声音会立刻跑过来。</p>
              </section>

              <button
                type="button"
                className="delete-pet-button"
                onClick={() => setDeletePetOpen(true)}
              >
                <Trash2 size={16} strokeWidth={1.8} aria-hidden="true" />
                删除宠物
              </button>
            </div>
          )}

          {tab === "records" && (
            <>
              <header className="page-header records-page-header">
                <div className="record-pet-picker">
                  <button
                    type="button"
                    className="record-pet-trigger"
                    onClick={() => setRecordPetPickerOpen(!recordPetPickerOpen)}
                    aria-label={`当前宠物${pet.name}，点击切换`}
                    aria-expanded={recordPetPickerOpen}
                  >
                    <span className="record-pet-avatar">
                      {"avatar" in pet ? (
                        <img src={pet.avatar} alt={`${pet.name}的头像`} />
                      ) : (
                        <em aria-hidden="true">{pet.emoji}</em>
                      )}
                    </span>
                    <ChevronDown size={15} strokeWidth={1.8} aria-hidden="true" />
                  </button>
                  {recordPetPickerOpen && (
                    <div className="record-pet-menu">
                      {petList.map((item, index) => (
                        <button
                          type="button"
                          className={index === petIndex ? "active" : ""}
                          key={item.name}
                          onClick={() => {
                            setPetIndex(index);
                            setRecordPetPickerOpen(false);
                          }}
                        >
                          <span>
                            {"avatar" in item ? (
                              <img src={item.avatar} alt="" />
                            ) : (
                              <em aria-hidden="true">{item.emoji}</em>
                            )}
                          </span>
                          <span><strong>{item.name}</strong><small>{item.type}</small></span>
                          {index === petIndex && <i>当前</i>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="icon-button calendar-action-button"
                  aria-label="打开日历"
                  onClick={() => {
                    setCalendarMonth(new Date(recordDate.getFullYear(), recordDate.getMonth(), 1));
                    setCalendarOpen(!calendarOpen);
                  }}
                >
                  <CalendarDays size={19} strokeWidth={1.8} aria-hidden="true" />
                </button>
              </header>
              <div className="date-select">
                <button
                  type="button"
                  aria-label="上一周"
                  onClick={() =>
                    setRecordDate((current) => {
                      const previous = new Date(current);
                      previous.setDate(current.getDate() - 7);
                      return previous;
                    })
                  }
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="date-select-label"
                  onClick={() => {
                    setCalendarMonth(new Date(recordDate.getFullYear(), recordDate.getMonth(), 1));
                    setCalendarOpen(!calendarOpen);
                  }}
                >
                  <strong>{recordDate.getFullYear()} 年 {recordDate.getMonth() + 1} 月</strong>
                </button>
                <button
                  type="button"
                  aria-label="下一周"
                  onClick={() =>
                    setRecordDate((current) => {
                      const next = new Date(current);
                      next.setDate(current.getDate() + 7);
                      return next;
                    })
                  }
                >
                  ›
                </button>
              </div>
              {calendarOpen && (
                <div className="calendar-popover">
                  <div className="calendar-popover-header">
                    <button
                      type="button"
                      onClick={() => setCalendarMonth(new Date(calendarYear, calendarMonthIndex - 1, 1))}
                      aria-label="上个月"
                    >
                      ‹
                    </button>
                    <strong>{calendarYear} 年 {calendarMonthIndex + 1} 月</strong>
                    <button
                      type="button"
                      onClick={() => setCalendarMonth(new Date(calendarYear, calendarMonthIndex + 1, 1))}
                      aria-label="下个月"
                    >
                      ›
                    </button>
                  </div>
                  <div className="calendar-weekdays">
                    {["一", "二", "三", "四", "五", "六", "日"].map((day) => <span key={day}>{day}</span>)}
                  </div>
                  <div className="calendar-days">
                    {calendarCells.map((day, index) =>
                      day ? (
                        <button
                          type="button"
                          className={
                            recordDate.getFullYear() === calendarYear &&
                            recordDate.getMonth() === calendarMonthIndex &&
                            recordDate.getDate() === day
                              ? "selected"
                              : ""
                          }
                          key={`${calendarYear}-${calendarMonthIndex}-${day}`}
                          onClick={() => {
                            setRecordDate(new Date(calendarYear, calendarMonthIndex, day));
                            setCalendarOpen(false);
                          }}
                        >
                          {day}
                        </button>
                      ) : <span key={`blank-${index}`} />
                    )}
                  </div>
                </div>
              )}
              <div className="week-strip">
                {recordWeekDates.map((date) => {
                  const active = date.toDateString() === recordDate.toDateString();
                  const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()];
                  return (
                    <button
                      className={active ? "active" : ""}
                      key={date.toISOString()}
                      onClick={() => setRecordDate(date)}
                    >
                      <small>{weekday}</small><strong>{date.getDate()}</strong><i />
                    </button>
                  );
                })}
              </div>
              <section className="score-card">
                <div className="score-ring"><strong>{petRecord.score}</strong><small>健康值</small></div>
                <div>
                  <p>今日健康状态</p>
                  <h2>状态{petRecord.status}</h2>
                  <span>
                    {petRecord.change > 0
                      ? `较上周提升 ${petRecord.change} 分 ↗`
                      : petRecord.change < 0
                        ? `较上周下降 ${Math.abs(petRecord.change)} 分 ↘`
                        : "与上周持平"}
                  </span>
                </div>
              </section>
              <section className="chart-card">
                <div className="section-heading compact">
                  <div><p>趋势分析</p><h2>近 7 日健康值</h2></div>
                  <span>平均 {averageHealthScore} 分</span>
                </div>
                <div className="line-chart" role="img" aria-label="近七日健康值折线图">
                  <svg viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden="true">
                    <line x1="8" y1="32" x2="292" y2="32" />
                    <line x1="8" y1="65" x2="292" y2="65" />
                    <line x1="8" y1="98" x2="292" y2="98" />
                    <polyline points={chartPoints} />
                    {chartValues.map((value, index) => (
                      <circle
                        key={index}
                        cx={18 + index * 44}
                        cy={110 - (value - 70) * 3}
                        r={index === chartValues.length - 1 ? 4.5 : 3.5}
                      />
                    ))}
                  </svg>
                  <div className="line-chart-labels">
                    {recordWeekDates.map((date) => <span key={date.toISOString()}>{date.getDate()}</span>)}
                  </div>
                </div>
              </section>
              <section className="record-summary">
                <div className="section-heading compact"><div><p>当日明细</p><h2>健康记录</h2></div></div>
                <div className="summary-grid">
                  {recordHealthItems.map((item) => {
                    const HealthIcon = homeHealthIcons[item.label];
                    return (
                      <div key={item.label}>
                        <span className="record-line-icon">
                          <HealthIcon size={18} strokeWidth={1.8} aria-hidden="true" />
                        </span>
                        <small>{item.label}</small>
                        <strong>{item.value} {item.unit}</strong>
                      </div>
                    );
                  })}
                </div>
              </section>
              <aside className="tip-card"><span>💡</span><p><strong>健康建议</strong>{petRecord.tip}</p></aside>
            </>
          )}

          {tab === "wiki" && !wikiAllOpen && !selectedBreed && (
            <div className="wiki-main-view">
              <header className="page-header wiki-header">
                <div>
                  <p className="eyebrow">PAW DAILY</p>
                  <h1>宠物百科</h1>
                </div>
              </header>
              <label className="search-box">
                <span>⌕</span>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索宠物品种" />
                {query && <button onClick={() => setQuery("")}>×</button>}
              </label>
              <section className="featured-breed">
                <div><small>今日推荐</small><h2>柯基犬的快乐秘诀</h2><p>每天适量运动、科学饮食与足够陪伴。</p><button>阅读养护指南 →</button></div>
                <span>🐕</span>
              </section>
              <div className="section-heading compact wiki-list-toolbar">
                <div className="wiki-filter">
                  <button
                    type="button"
                    className="wiki-filter-trigger"
                    onClick={() => setWikiFilterOpen(!wikiFilterOpen)}
                    aria-expanded={wikiFilterOpen}
                  >
                    <ListFilter size={15} strokeWidth={1.8} aria-hidden="true" />
                    筛选
                    <ChevronDown size={14} strokeWidth={1.8} aria-hidden="true" />
                  </button>
                  {wikiFilterOpen && (
                    <div className="wiki-filter-menu">
                      {[
                        { value: "全部", label: "全部" },
                        { value: "犬类", label: "狗类" },
                        { value: "猫类", label: "猫类" },
                      ].map((item) => (
                        <button
                          type="button"
                          className={filter === item.value ? "active" : ""}
                          key={item.value}
                          onClick={() => {
                            setFilter(item.value);
                            setWikiFilterOpen(false);
                          }}
                        >
                          <span>{item.label}</span>
                          {filter === item.value && <Check size={14} strokeWidth={2} aria-hidden="true" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="wiki-view-all"
                  onClick={() => {
                    setWikiFilterOpen(false);
                    setWikiAllOpen(true);
                  }}
                >
                  查看全部
                  <ChevronRight size={14} strokeWidth={1.8} aria-hidden="true" />
                </button>
              </div>
              <section className="breed-grid">
                {filteredBreeds.slice(0, 8).map((breed) => (
                  <button
                    type="button"
                    className="breed-card"
                    key={breed.name}
                    onClick={() => setSelectedBreed(breed)}
                    aria-label={`查看${breed.name}百科详情`}
                  >
                    <div className="breed-art"><span>{breed.emoji}</span><small>{breed.type}</small></div>
                    <h3>{breed.name}</h3>
                    <p>{breed.trait}</p>
                    <footer><span>平均寿命</span><strong>{breed.age}</strong></footer>
                  </button>
                ))}
              </section>
              {!filteredBreeds.length && <div className="empty-state"><span>🐾</span><p>没有找到相关品种</p></div>}
              {!!filteredBreeds.length && (
                <button
                  type="button"
                  className="wiki-bottom-view-all"
                  onClick={() => {
                    setWikiFilterOpen(false);
                    setWikiAllOpen(true);
                  }}
                >
                  <span className="wiki-bottom-view-icon"><BookOpen size={19} strokeWidth={1.8} aria-hidden="true" /></span>
                  <span className="wiki-bottom-view-copy">
                    <strong>查看所有宠物</strong>
                    <small>继续探索完整品种百科</small>
                  </span>
                  <ChevronRight size={18} strokeWidth={1.8} aria-hidden="true" />
                </button>
              )}
            </div>
          )}

          {wikiAllOpen && !selectedBreed && (
            <div className="wiki-all-view">
              <header className="pet-profile-header">
                <button type="button" onClick={() => setWikiAllOpen(false)} aria-label="返回宠物百科">
                  <ArrowLeft size={20} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <div>
                  <small>宠物百科</small>
                  <h1>全部品种</h1>
                </div>
              </header>

              <label className="search-box">
                <span>⌕</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索全部宠物品种" />
                {query && <button onClick={() => setQuery("")}>×</button>}
              </label>

              <div className="wiki-all-toolbar">
                <span>共 {filteredBreeds.length} 个品种</span>
                <div className="wiki-filter">
                  <button
                    type="button"
                    className="wiki-filter-trigger"
                    onClick={() => setWikiFilterOpen(!wikiFilterOpen)}
                    aria-expanded={wikiFilterOpen}
                  >
                    <ListFilter size={15} strokeWidth={1.8} aria-hidden="true" />
                    筛选
                    <ChevronDown size={14} strokeWidth={1.8} aria-hidden="true" />
                  </button>
                  {wikiFilterOpen && (
                    <div className="wiki-filter-menu">
                      {[
                        { value: "全部", label: "全部" },
                        { value: "犬类", label: "狗类" },
                        { value: "猫类", label: "猫类" },
                      ].map((item) => (
                        <button
                          type="button"
                          className={filter === item.value ? "active" : ""}
                          key={item.value}
                          onClick={() => {
                            setFilter(item.value);
                            setWikiFilterOpen(false);
                          }}
                        >
                          <span>{item.label}</span>
                          {filter === item.value && <Check size={14} strokeWidth={2} aria-hidden="true" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <section className="breed-grid wiki-all-grid">
                {filteredBreeds.map((breed) => (
                  <button
                    type="button"
                    className="breed-card"
                    key={breed.name}
                    onClick={() => setSelectedBreed(breed)}
                    aria-label={`查看${breed.name}百科详情`}
                  >
                    <div className="breed-art"><span>{breed.emoji}</span><small>{breed.type}</small></div>
                    <h3>{breed.name}</h3>
                    <p>{breed.trait}</p>
                    <footer><span>平均寿命</span><strong>{breed.age}</strong></footer>
                  </button>
                ))}
              </section>
              {!filteredBreeds.length && <div className="empty-state"><span>🐾</span><p>没有找到相关品种</p></div>}
            </div>
          )}

          {selectedBreed && (
            <div className="breed-detail-view">
              <header className="pet-profile-header">
                <button type="button" onClick={() => setSelectedBreed(null)} aria-label="返回品种列表">
                  <ArrowLeft size={20} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <div>
                  <small>宠物百科</small>
                  <h1>品种详情</h1>
                </div>
              </header>

              <section className="breed-detail-hero">
                <div className="breed-detail-art" role="img" aria-label={`${selectedBreed.name}品种形象`}>
                  <span>{selectedBreed.emoji}</span>
                </div>
                <div>
                  <small>{selectedBreed.type} · 品种图鉴</small>
                  <h2>{selectedBreed.name}</h2>
                  <p>{selectedBreed.trait}</p>
                </div>
              </section>

              <section className="breed-facts-card">
                <div className="breed-detail-heading">
                  <div><small>品种信息</small><h2>认识它</h2></div>
                  <PawPrint size={19} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className="breed-facts-grid">
                  {[
                    [Ruler, "体型", selectedBreed.size],
                    [Activity, "运动量", selectedBreed.exercise],
                    [Scissors, "掉毛程度", selectedBreed.shedding],
                    [Bone, "饭量", selectedBreed.appetite],
                    [Sparkles, "体味", selectedBreed.odor],
                    [Cake, "平均寿命", selectedBreed.age],
                  ].map(([Icon, label, value]) => {
                    const FactIcon = Icon as LucideIcon;
                    return (
                      <div className="breed-fact" key={label as string}>
                        <span><FactIcon size={17} strokeWidth={1.8} aria-hidden="true" /></span>
                        <small>{label as string}</small>
                        <strong>{value as string}</strong>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="breed-story-card">
                <small>性格与陪伴</small>
                <h2>{selectedBreed.trait.replace(" · ", "，也")}</h2>
                <p>{selectedBreed.intro}</p>
              </section>

              <section className="breed-care-card">
                <div className="breed-detail-heading">
                  <div><small>日常养护</small><h2>陪伴建议</h2></div>
                  <HeartPulse size={19} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <p>{selectedBreed.care}</p>
              </section>

              <section className="breed-comments-card">
                <div className="breed-detail-heading">
                  <div><small>真实经验</small><h2>评论区</h2></div>
                  <MessageCircle size={19} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <article>
                  <span>林</span>
                  <div><strong>林安</strong><p>信息很实用，尤其是运动量和日常养护建议，准备养宠前更有底了。</p></div>
                </article>
                <article>
                  <span>周</span>
                  <div><strong>周末养宠人</strong><p>我家的{selectedBreed.name}也很符合这个性格描述，规律陪伴真的很重要。</p></div>
                </article>
                <button type="button">写下你的养宠经验</button>
              </section>
            </div>
          )}

          {tab === "profile" && profileInfoOpen && !messagesOpen && (
            <div className="personal-profile-view">
              <header className="pet-profile-header">
                <button type="button" onClick={() => setProfileInfoOpen(false)} aria-label="返回我的页面">
                  <ArrowLeft size={20} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <div>
                  <small>账号资料</small>
                  <h1>个人信息</h1>
                </div>
              </header>

              <section className="personal-profile-hero">
                <div className="personal-profile-avatar">{accountProfile.name.slice(0, 1) || "林"}</div>
              </section>

              <section className="personal-info-card">
                <div className="personal-info-heading">
                  <div><small>账号信息</small><h2>基本资料</h2></div>
                  <button
                    type="button"
                    className="personal-edit-button"
                    onClick={() => {
                      setAccountDraft(accountProfile);
                      setPersonalEditorOpen(true);
                    }}
                  >
                    <Pencil size={14} strokeWidth={1.8} aria-hidden="true" />
                    修改
                  </button>
                </div>
                <div className="personal-info-list">
                  {[
                    [UserRound, "昵称", accountProfile.name],
                    [PawPrint, "身份", "铲屎官"],
                    [Smartphone, "手机号码", accountProfile.phone],
                    [MapPin, "所在城市", accountProfile.city],
                    [CalendarDays, "加入时间", "2024.04.22"],
                    [HeartPulse, "陪伴天数", "826 天"],
                  ].map(([Icon, label, value]) => {
                    const InfoIcon = Icon as LucideIcon;
                    return (
                      <div key={label as string}>
                        <span><InfoIcon size={18} strokeWidth={1.8} aria-hidden="true" /></span>
                        <p><small>{label as string}</small><strong>{value as string}</strong></p>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="personal-bio-card">
                <small>个人简介</small>
                <h2>认真记录每一天的陪伴</h2>
                <p>{accountProfile.bio}</p>
              </section>

              <button type="button" className="logout-button" onClick={() => setLogoutConfirmOpen(true)}>
                <LogOut size={17} strokeWidth={1.8} aria-hidden="true" />
                退出登录
              </button>
            </div>
          )}

          {tab === "profile" && familyGroupOpen && !messagesOpen && (
            <div className="family-group-view">
              <header className="pet-profile-header">
                <button type="button" onClick={() => setFamilyGroupOpen(false)} aria-label="返回我的页面">
                  <ArrowLeft size={20} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <div>
                  <small>一起照顾</small>
                  <h1>家庭组</h1>
                </div>
              </header>

              <section className="family-member-card">
                <div className="secondary-section-title"><small>共同成员</small><h2>家庭成员</h2></div>
                {[
                  ["林", "林安", "管理员", "今天活跃", "coral"],
                  ["陈", "陈晨", "成员", "10 分钟前活跃", "teal"],
                  ["周", "周宁", "成员", "昨天活跃", "purple"],
                ].map(([avatar, name, role, activity, tone]) => (
                  <article className="family-member-row" key={name}>
                    <span className={`family-member-avatar ${tone}`}>{avatar}</span>
                    <p><strong>{name}</strong><small>{activity}</small></p>
                    <em className={role === "管理员" ? "admin" : ""}>{role}</em>
                  </article>
                ))}
              </section>

              <button type="button" className="invite-family-button">
                <span><UserPlus size={19} strokeWidth={1.8} aria-hidden="true" /></span>
                <p><strong>邀请新成员</strong><small>分享邀请，让家人一起参与照顾</small></p>
                <ChevronRight size={17} strokeWidth={1.8} aria-hidden="true" />
              </button>

              <section className="family-group-actions">
                <button type="button">
                  <span><ClipboardList size={18} strokeWidth={1.8} aria-hidden="true" /></span>
                  <p><strong>加入申请</strong><small>暂无待处理申请</small></p>
                  <ChevronRight size={16} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <button type="button">
                  <span><PawPrint size={18} strokeWidth={1.8} aria-hidden="true" /></span>
                  <p><strong>共同照顾的宠物</strong><small>旺财、糯米</small></p>
                  <ChevronRight size={16} strokeWidth={1.8} aria-hidden="true" />
                </button>
              </section>
            </div>
          )}

          {tab === "profile" && profilePanel === "settings" && !messagesOpen && (
            <div className="profile-secondary-view">
              <header className="pet-profile-header">
                <button type="button" onClick={() => setProfilePanel(null)} aria-label="返回我的页面">
                  <ArrowLeft size={20} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <div>
                  <small>应用偏好</small>
                  <h1>系统设置</h1>
                </div>
              </header>

              <section className="settings-group">
                <div className="secondary-section-title"><small>通知偏好</small><h2>提醒设置</h2></div>
                {[
                  [Bell, "任务提醒", "喂食、遛弯等日常安排", "taskReminders"],
                ].map(([Icon, label, detail, key]) => {
                  const SettingIcon = Icon as LucideIcon;
                  const settingKey = key as keyof typeof appSettings;
                  return (
                    <button
                      type="button"
                      className="setting-row"
                      key={settingKey}
                      onClick={() => setAppSettings({ ...appSettings, [settingKey]: !appSettings[settingKey] })}
                      aria-pressed={appSettings[settingKey]}
                    >
                      <span><SettingIcon size={18} strokeWidth={1.8} aria-hidden="true" /></span>
                      <p><strong>{label as string}</strong><small>{detail as string}</small></p>
                      <i className={appSettings[settingKey] ? "switch active" : "switch"}><b /></i>
                    </button>
                  );
                })}
              </section>

              <section className="settings-group">
                <div className="secondary-section-title"><small>账号安全</small><h2>隐私与权限</h2></div>
                <button type="button" className="setting-link">
                  <span><LockKeyhole size={18} strokeWidth={1.8} aria-hidden="true" /></span>
                  <p><strong>隐私设置</strong><small>管理家庭组与数据可见范围</small></p>
                  <ChevronRight size={16} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <button type="button" className="setting-link">
                  <span><ShieldCheck size={18} strokeWidth={1.8} aria-hidden="true" /></span>
                  <p><strong>账号安全</strong><small>密码与登录设备管理</small></p>
                  <ChevronRight size={16} strokeWidth={1.8} aria-hidden="true" />
                </button>
              </section>
            </div>
          )}

          {tab === "profile" && profilePanel === "help" && !messagesOpen && (
            <div className="profile-secondary-view">
              <header className="pet-profile-header">
                <button type="button" onClick={() => setProfilePanel(null)} aria-label="返回我的页面">
                  <ArrowLeft size={20} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <div>
                  <small>服务支持</small>
                  <h1>帮助与反馈</h1>
                </div>
              </header>

              <section className="faq-card">
                <div className="secondary-section-title"><small>使用指南</small><h2>常见问题</h2></div>
                {[
                  ["如何添加新的宠物？", "在首页宠物卡片右上角进入宠物管理，然后点击底部的“添加宠物”。"],
                  ["健康记录可以修改吗？", "当天提交的健康打卡可以再次打开并修改，历史记录将保留最终提交结果。"],
                  ["如何邀请家人一起照顾？", "进入“我的—家庭组—管理”，可生成邀请并选择家庭成员权限。"],
                ].map(([question, answer], index) => (
                  <button
                    type="button"
                    className={openFaq === index ? "faq-item open" : "faq-item"}
                    key={question}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    aria-expanded={openFaq === index}
                  >
                    <span><strong>{question}</strong><ChevronDown size={15} strokeWidth={1.8} aria-hidden="true" /></span>
                    {openFaq === index && <p>{answer}</p>}
                  </button>
                ))}
              </section>

              <section className="feedback-card">
                <span><MessageCircle size={21} strokeWidth={1.8} aria-hidden="true" /></span>
                <div><small>意见反馈</small><h2>告诉我们你的想法</h2><p>工作日 9:00–18:00 通常会在 24 小时内回复。</p></div>
                <button type="button">提交反馈</button>
              </section>
            </div>
          )}

          {tab === "profile" && !messagesOpen && !profileInfoOpen && !familyGroupOpen && !profilePanel && (
            <div className="profile-main-view">
              <section className="profile-card">
                <button
                  type="button"
                  className="profile-card-main"
                  onClick={() => setProfileInfoOpen(true)}
                  aria-label={`查看${accountProfile.name}的个人信息`}
                >
                  <div className="avatar">{accountProfile.name.slice(0, 1) || "林"}</div>
                  <div><small>铲屎官</small><h2>{accountProfile.name}</h2><p>陪伴毛孩子的第 826 天</p></div>
                </button>
                <button
                  type="button"
                  className="icon-button profile-message-button"
                  aria-label="消息提醒"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMessagesOpen(true);
                  }}
                >
                  <Bell size={19} strokeWidth={1.8} aria-hidden="true" />
                  {unreadMessageCount > 0 && <i />}
                </button>
              </section>
              <section
                className="family-card"
                role="button"
                tabIndex={0}
                onClick={() => setFamilyGroupOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") setFamilyGroupOpen(true);
                }}
                aria-label="进入家庭组管理"
              >
                <div className="section-heading compact"><div><p>一起照顾</p><h2>家庭组</h2></div><button type="button" onClick={() => setFamilyGroupOpen(true)}>管理 ›</button></div>
                <div className="family-members">
                  <span className="member coral">林</span><span className="member teal">陈</span><span className="member purple">周</span><button type="button" onClick={() => setFamilyGroupOpen(true)}>＋</button>
                </div>
                <p>3 位家庭成员 · 共同照顾 2 只宠物</p>
              </section>
              <section className="menu-list">
                {[
                  [Bell, "消息提醒", `${unreadMessageCount} 条未读`, () => setMessagesOpen(true)],
                  [Settings, "系统设置", "", () => setProfilePanel("settings")],
                  [CircleHelp, "帮助与反馈", "", () => setProfilePanel("help")],
                ].map(([Icon, label, detail, onClick]) => {
                  const MenuIcon = Icon as LucideIcon;
                  return (
                    <button key={label as string} type="button" onClick={onClick as (() => void) | undefined}>
                      <span><MenuIcon size={18} strokeWidth={1.8} aria-hidden="true" /></span>
                      <strong>{label as string}</strong>
                      <small>{detail as string}</small>
                      <ChevronRight size={15} strokeWidth={1.8} aria-hidden="true" />
                    </button>
                  );
                })}
              </section>
              <p className="version">宠物健康助手 · v1.0.0</p>
            </div>
          )}
        </div>

        {!petProfileOpen && !petManagementOpen && !messagesOpen && !profileInfoOpen && !familyGroupOpen && !profilePanel && !wikiAllOpen && !selectedBreed && <nav className={`tab-bar${tab === "profile" ? " profile-tab-bar" : ""}`}>
          {([
            ["home", House, "首页"],
            ["records", ClipboardList, "记录"],
            ["wiki", BookOpen, "百科"],
            ["profile", UserRound, "我的"],
          ] as [Tab, LucideIcon, string][]).map(([key, Icon, label]) => (
            <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
              <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
              <small>{label}</small>
            </button>
          ))}
        </nav>}
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

      {profileEditorOpen && (
        <div className="modal-backdrop" onMouseDown={() => setProfileEditorOpen(false)}>
          <section className="modal profile-edit-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-handle" />
            <div className="section-heading compact">
              <div><p>宠物档案</p><h2>编辑基本信息</h2></div>
              <button type="button" onClick={() => setProfileEditorOpen(false)} aria-label="关闭编辑面板">×</button>
            </div>
            <div className="profile-edit-fields">
              <label>
                性别
                <select
                  value={profileDraft.gender}
                  onChange={(event) => setProfileDraft({ ...profileDraft, gender: event.target.value })}
                >
                  <option>男孩</option>
                  <option>女孩</option>
                </select>
              </label>
              <label>
                当前体重（kg）
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={profileDraft.weight}
                  onChange={(event) => setProfileDraft({ ...profileDraft, weight: event.target.value })}
                />
              </label>
              <label>
                出生日期
                <input
                  type="date"
                  value={profileDraft.birthday}
                  onChange={(event) => setProfileDraft({ ...profileDraft, birthday: event.target.value })}
                />
              </label>
              <label>
                到家日期
                <input
                  type="date"
                  value={profileDraft.arrival}
                  onChange={(event) => setProfileDraft({ ...profileDraft, arrival: event.target.value })}
                />
              </label>
            </div>
            <div className="profile-edit-actions">
              <button type="button" onClick={() => setProfileEditorOpen(false)}>取消</button>
              <button
                type="button"
                onClick={() => {
                  setPetProfiles((profiles) =>
                    profiles.map((profile, index) => index === petIndex ? profileDraft : profile),
                  );
                  setProfileEditorOpen(false);
                }}
              >
                保存修改
              </button>
            </div>
          </section>
        </div>
      )}

      {personalEditorOpen && (
        <div className="modal-backdrop" onMouseDown={() => setPersonalEditorOpen(false)}>
          <section className="modal profile-edit-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-handle" />
            <div className="section-heading compact">
              <div><p>账号资料</p><h2>修改个人信息</h2></div>
              <button type="button" onClick={() => setPersonalEditorOpen(false)} aria-label="关闭个人信息编辑面板">×</button>
            </div>
            <div className="profile-edit-fields">
              <label>
                昵称
                <input
                  value={accountDraft.name}
                  onChange={(event) => setAccountDraft({ ...accountDraft, name: event.target.value })}
                  placeholder="请输入昵称"
                />
              </label>
              <label>
                手机号码
                <input
                  value={accountDraft.phone}
                  onChange={(event) => setAccountDraft({ ...accountDraft, phone: event.target.value })}
                  placeholder="请输入手机号码"
                />
              </label>
              <label>
                所在城市
                <input
                  value={accountDraft.city}
                  onChange={(event) => setAccountDraft({ ...accountDraft, city: event.target.value })}
                  placeholder="例如：浙江 · 杭州"
                />
              </label>
              <label className="personal-bio-field">
                个人简介
                <textarea
                  value={accountDraft.bio}
                  onChange={(event) => setAccountDraft({ ...accountDraft, bio: event.target.value })}
                  rows={3}
                />
              </label>
            </div>
            <div className="profile-edit-actions">
              <button type="button" onClick={() => setPersonalEditorOpen(false)}>取消</button>
              <button
                type="button"
                disabled={!accountDraft.name.trim()}
                onClick={() => {
                  setAccountProfile({
                    ...accountDraft,
                    name: accountDraft.name.trim(),
                    phone: accountDraft.phone.trim(),
                    city: accountDraft.city.trim(),
                    bio: accountDraft.bio.trim(),
                  });
                  setPersonalEditorOpen(false);
                }}
              >
                保存修改
              </button>
            </div>
          </section>
        </div>
      )}

      {logoutConfirmOpen && (
        <div className="modal-backdrop" onMouseDown={() => setLogoutConfirmOpen(false)}>
          <section className="modal delete-confirm-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-handle" />
            <div className="logout-confirm-icon">
              <LogOut size={22} strokeWidth={1.8} aria-hidden="true" />
            </div>
            <h2>确认退出登录？</h2>
            <p className="delete-confirm-copy">退出后需要重新登录才能继续查看账号资料与家庭宠物信息。</p>
            <div className="profile-edit-actions">
              <button type="button" onClick={() => setLogoutConfirmOpen(false)}>取消</button>
              <button
                type="button"
                className="danger-confirm"
                onClick={() => {
                  setLogoutConfirmOpen(false);
                  setProfileInfoOpen(false);
                  setTab("home");
                }}
              >
                确认退出
              </button>
            </div>
          </section>
        </div>
      )}

      {deletePetOpen && (
        <div className="modal-backdrop" onMouseDown={() => setDeletePetOpen(false)}>
          <section className="modal delete-confirm-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-handle" />
            <div className="delete-confirm-icon">
              <Trash2 size={22} strokeWidth={1.8} aria-hidden="true" />
            </div>
            <h2>确认删除{pet.name}？</h2>
            <p className="delete-confirm-copy">
              删除后，该宠物的档案与当前页面记录将从列表中移除。此操作需要重新添加宠物才能恢复。
            </p>
            {petList.length === 1 && <p className="delete-limit-tip">至少需要保留一只宠物，当前无法删除。</p>}
            <div className="profile-edit-actions">
              <button type="button" onClick={() => setDeletePetOpen(false)}>取消</button>
              <button
                type="button"
                className="danger-confirm"
                disabled={petList.length === 1}
                onClick={() => {
                  setPetList((items) => items.filter((_, index) => index !== petIndex));
                  setCheckedInPets((names) => names.filter((name) => name !== pet.name));
                  setPetProfiles((profiles) => profiles.filter((_, index) => index !== petIndex));
                  setPetRecords((records) => records.filter((_, index) => index !== petIndex));
                  setPetIndex(0);
                  setDeletePetOpen(false);
                  setPetProfileOpen(false);
                  if (petProfileSource === "management") {
                    setPetManagementOpen(true);
                  }
                }}
              >
                确认删除
              </button>
            </div>
          </section>
        </div>
      )}

      {addPetOpen && (
        <div className="modal-backdrop" onMouseDown={() => setAddPetOpen(false)}>
          <section className="modal add-pet-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-handle" />
            <div className="section-heading compact">
              <div><p>家庭新成员</p><h2>添加宠物</h2></div>
              <button type="button" onClick={() => setAddPetOpen(false)} aria-label="关闭添加宠物面板">×</button>
            </div>
            <div className="profile-edit-fields">
              <label>
                宠物昵称
                <input
                  value={newPetDraft.name}
                  onChange={(event) => setNewPetDraft({ ...newPetDraft, name: event.target.value })}
                  placeholder="例如：豆包"
                />
              </label>
              <label>
                宠物类型
                <select
                  value={newPetDraft.species}
                  onChange={(event) => setNewPetDraft({ ...newPetDraft, species: event.target.value })}
                >
                  <option>狗狗</option>
                  <option>猫咪</option>
                </select>
              </label>
              <label>
                品种
                <input
                  value={newPetDraft.breed}
                  onChange={(event) => setNewPetDraft({ ...newPetDraft, breed: event.target.value })}
                  placeholder="例如：金毛犬"
                />
              </label>
              <label>
                年龄
                <input
                  value={newPetDraft.age}
                  onChange={(event) => setNewPetDraft({ ...newPetDraft, age: event.target.value })}
                  placeholder="例如：1岁 2个月"
                />
              </label>
              <label>
                性别
                <select
                  value={newPetDraft.gender}
                  onChange={(event) => setNewPetDraft({ ...newPetDraft, gender: event.target.value })}
                >
                  <option>男孩</option>
                  <option>女孩</option>
                </select>
              </label>
            </div>
            <div className="profile-edit-actions">
              <button type="button" onClick={() => setAddPetOpen(false)}>取消</button>
              <button
                type="button"
                disabled={!newPetDraft.name.trim()}
                onClick={() => {
                  const isCat = newPetDraft.species === "猫咪";
                  const newIndex = petList.length;
                  setPetList((items) => [
                    ...items,
                    {
                      name: newPetDraft.name.trim(),
                      type: newPetDraft.breed.trim() || (isCat ? "猫咪" : "狗狗"),
                      age: newPetDraft.age.trim() || "年龄待完善",
                      emoji: isCat ? "🐈" : "🐕",
                      tone: isCat ? "blue" : "gold",
                    },
                  ]);
                  setPetProfiles((profiles) => [
                    ...profiles,
                    {
                      gender: newPetDraft.gender,
                      birthday: "",
                      weight: "--",
                      arrival: new Date().toISOString().slice(0, 10),
                    },
                  ]);
                  setPetRecords((records) => [...records, createDefaultPetRecord()]);
                  setPetIndex(newIndex);
                  setNewPetDraft({ name: "", species: "狗狗", breed: "", age: "", gender: "男孩" });
                  setAddPetOpen(false);
                }}
              >
                添加宠物
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
