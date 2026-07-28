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
  Clock3,
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
  Search,
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
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

type Tab = "home" | "records" | "wiki" | "profile";
type HealthCheckSettings = {
  food: "g" | "状态";
  water: "ml" | "状态";
  walk: "分钟" | "公里";
};

const taskHours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
const taskMinutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"));
const taskTimeWheelItemHeight = 52;

const initialPets = [
  { name: "旺财", type: "柯基犬", age: "2岁 4个月", emoji: "🐕", tone: "gold", avatar: "/pet-avatar-corgi.png" },
  { name: "糯米", type: "英短猫", age: "1岁 8个月", emoji: "🐈", tone: "blue" },
];

const initialPetProfiles = [
  { gender: "男孩", birthday: "2024-03-18", weight: "10.8", arrival: "2024-07-06" },
  { gender: "女孩", birthday: "2024-11-12", weight: "4.6", arrival: "2025-02-16" },
];

type PetTask = {
  id: number;
  time: string;
  title: string;
  note: string;
  done: boolean;
  icon: string;
  repeat?: string;
  intervalDays?: number;
  petNames?: string[];
};

const initialTasks: PetTask[] = [
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
  bodySize: "小型" | "中型" | "大型";
  coatLength: "短毛" | "中长毛" | "长毛";
  activity: "较低" | "适中" | "较高";
  sheddingLevel: "较少" | "一般" | "较多";
  size: string;
  exercise: string;
  shedding: string;
  appetite: string;
  odor: string;
  intro: string;
  care: string;
};

type WikiAllFilters = {
  type: "全部" | "犬类" | "猫类";
  bodySize: "全部" | "小型" | "中型" | "大型";
  coatLength: "全部" | "短毛" | "中长毛" | "长毛";
  activity: "全部" | "较低" | "适中" | "较高";
  sheddingLevel: "全部" | "较少" | "一般" | "较多";
};

const defaultWikiAllFilters: WikiAllFilters = {
  type: "全部",
  bodySize: "全部",
  coatLength: "全部",
  activity: "全部",
  sheddingLevel: "全部",
};

const wikiAllFilterGroups: {
  key: keyof WikiAllFilters;
  label: string;
  options: { value: string; label: string }[];
}[] = [
  {
    key: "type",
    label: "宠物类型",
    options: [
      { value: "全部", label: "全部" },
      { value: "猫类", label: "猫" },
      { value: "犬类", label: "狗" },
    ],
  },
  {
    key: "bodySize",
    label: "体型",
    options: [
      { value: "全部", label: "不限" },
      { value: "小型", label: "小型" },
      { value: "中型", label: "中型" },
      { value: "大型", label: "大型" },
    ],
  },
  {
    key: "coatLength",
    label: "毛发长度",
    options: [
      { value: "全部", label: "不限" },
      { value: "短毛", label: "短毛" },
      { value: "中长毛", label: "中长毛" },
      { value: "长毛", label: "长毛" },
    ],
  },
  {
    key: "activity",
    label: "活动量",
    options: [
      { value: "全部", label: "不限" },
      { value: "较低", label: "较低" },
      { value: "适中", label: "适中" },
      { value: "较高", label: "较高" },
    ],
  },
  {
    key: "sheddingLevel",
    label: "掉毛程度",
    options: [
      { value: "全部", label: "不限" },
      { value: "较少", label: "较少" },
      { value: "一般", label: "一般" },
      { value: "较多", label: "较多" },
    ],
  },
];

const petCareGuideSections = [
  {
    icon: "🏠",
    title: "养宠前先做好评估",
    paragraphs: [
      "确认所有家庭成员是否同意养宠，并了解家中是否有人对动物毛发过敏。租房居住时，还要提前确认房屋是否允许饲养宠物。",
      "选择宠物不能只看外观，应结合居住空间、工作时间、家庭成员和养宠经验，了解不同品种的体型、活动量、掉毛程度、性格与养护难度。",
      "还需要预留主粮、日常用品、疫苗、驱虫、绝育、体检和突发就医等费用。猫狗通常能够陪伴家庭十年以上，养宠是一项长期责任。",
    ],
  },
  {
    icon: "🧺",
    title: "接宠物回家前的物品准备",
    paragraphs: [
      "提前准备适龄主粮、食盆和水碗、舒适的睡垫、航空箱或宠物包、梳毛与清洁用品、宠物专用指甲剪，以及安全耐用的玩具。",
      "养猫还需要猫砂盆、猫砂、猫抓板和猫爬架；养狗则需要牵引绳、胸背带、拾便袋和排泄训练用品。用品应放在安全、安静且方便宠物使用的位置。",
    ],
  },
  {
    icon: "🌿",
    title: "给新成员适应环境的时间",
    paragraphs: [
      "宠物刚进入陌生环境时，可能躲藏、紧张、食欲下降或不愿互动。最初几天应提供安静、安全的适应区域，不要频繁抱起、追赶或强迫亲近。",
      "家中已有其他宠物时，应先从气味熟悉开始，再逐步安排短时间接触。尽量延续原来的饮食，换粮时逐渐增加新粮比例，避免突然改变。",
    ],
  },
  {
    icon: "🥣",
    title: "日常饮食与饮水",
    paragraphs: [
      "根据宠物的年龄、体重、活动量和主粮说明定时定量喂食，零食不能替代正餐，也不宜因为宠物讨食而频繁加餐。",
      "每天提供干净、新鲜的饮水并清洗水碗。不要随意喂食巧克力、葡萄、葡萄干、洋葱、大蒜、酒精、含咖啡因食品，以及其他不确定是否安全的人类食物。",
    ],
  },
  {
    icon: "🎾",
    title: "运动、陪伴与行为引导",
    paragraphs: [
      "狗狗需要规律散步和活动，强度应根据年龄、体型和健康状况调整；猫咪也需要通过逗猫棒、益智玩具和猫爬架释放精力。",
      "训练时以奖励和正向引导为主，在宠物做出正确行为后及时表扬。持续打骂或恐吓容易让宠物产生害怕、躲避甚至攻击反应。",
    ],
  },
  {
    icon: "🧼",
    title: "清洁与居住环境",
    paragraphs: [
      "食盆、水碗、睡垫、玩具和排泄区域都需要定期清洁。猫砂盆应每天清理，狗狗排泄后应及时处理。",
      "根据毛发长度和掉毛程度安排梳毛，长毛宠物尤其要防止打结。洗澡不宜过于频繁，应使用宠物专用洗护用品并及时彻底吹干。",
    ],
  },
  {
    icon: "🩺",
    title: "疫苗、驱虫与健康观察",
    paragraphs: [
      "了解宠物已有的疫苗、驱虫和健康记录，再根据专业宠物医生的建议安排后续计划。",
      "日常记录食欲、饮水、排便、排尿、精神状态、活动量和体重变化。如果出现持续拒食、频繁呕吐、严重腹泻、呼吸异常、排尿困难或明显疼痛，应及时联系专业宠物医生，不要自行使用人类药物。",
    ],
  },
  {
    icon: "🛡️",
    title: "居家与外出安全",
    paragraphs: [
      "窗户和阳台应安装牢固的防护设施，药品、清洁剂、电线、尖锐物品和容易误食的小物件要放在宠物无法接触的位置。",
      "摆放植物前应确认其对猫狗是否安全。狗狗外出时佩戴牵引绳，不要让宠物独自留在密闭车辆中，也不要在炎热天气长时间进行户外活动。",
    ],
  },
  {
    icon: "🤎",
    title: "把长期责任放在第一位",
    paragraphs: [
      "宠物需要的不只是食物和住所，还需要稳定的生活规律、耐心的行为引导以及持续的情绪陪伴。",
      "在决定养宠前，应认真考虑未来十几年可能发生的搬家、工作变化、生病和衰老等情况。一旦把它带回家，就应尽可能为它提供安全、健康和稳定的一生。",
    ],
  },
];

const breeds: Breed[] = [
  {
    name: "威尔士柯基犬", type: "犬类", trait: "活泼 · 亲人", age: "12–15 年", emoji: "🐕",
    bodySize: "小型", coatLength: "短毛", activity: "较高", sheddingLevel: "较多",
    size: "小型犬", exercise: "中高", shedding: "较多", appetite: "中等", odor: "较轻",
    intro: "短腿、大耳朵和灿烂笑容是它的标志。性格开朗，喜欢参与家庭活动，也很愿意和人互动。",
    care: "每天安排 45–60 分钟散步，控制体重并减少频繁上下楼，换毛期需要增加梳毛频率。",
  },
  {
    name: "英国短毛猫", type: "猫类", trait: "温和 · 安静", age: "14–18 年", emoji: "🐈",
    bodySize: "中型", coatLength: "短毛", activity: "较低", sheddingLevel: "一般",
    size: "中型猫", exercise: "中低", shedding: "中等", appetite: "较好", odor: "很轻",
    intro: "圆脸、厚实被毛和沉稳气质很有辨识度。适应力强，独处时安静，也乐于陪伴家人。",
    care: "每周梳毛 2–3 次，准备益智玩具鼓励活动，并关注饮食热量与体重变化。",
  },
  {
    name: "金毛寻回犬", type: "犬类", trait: "友善 · 聪明", age: "10–12 年", emoji: "🦮",
    bodySize: "大型", coatLength: "中长毛", activity: "较高", sheddingLevel: "较多",
    size: "大型犬", exercise: "高", shedding: "较多", appetite: "较大", odor: "中等",
    intro: "性格温和、学习能力强，对儿童和其他宠物通常十分友善，是热情可靠的家庭伙伴。",
    care: "每天保证 60–90 分钟运动，定期清洁耳道并梳理长毛，训练时适合使用正向奖励。",
  },
  {
    name: "布偶猫", type: "猫类", trait: "温顺 · 粘人", age: "13–16 年", emoji: "🐱",
    bodySize: "大型", coatLength: "长毛", activity: "较低", sheddingLevel: "较多",
    size: "大型猫", exercise: "中低", shedding: "较多", appetite: "中等", odor: "很轻",
    intro: "拥有蓝色眼睛和柔软长毛，性格温柔且依恋家人，喜欢在熟悉的人身边安静陪伴。",
    care: "每周梳毛 3–4 次以减少打结，设置低强度互动游戏，并注意饮水量与口腔护理。",
  },
  {
    name: "柴犬", type: "犬类", trait: "独立 · 忠诚", age: "12–15 年", emoji: "🐕",
    bodySize: "中型", coatLength: "短毛", activity: "较高", sheddingLevel: "较多",
    size: "中小型犬", exercise: "中高", shedding: "较多", appetite: "中等", odor: "较轻",
    intro: "警觉、利落又很有主见，对家人忠诚。早期社会化能帮助它更从容地面对陌生环境。",
    care: "保持规律运动和边界清晰的训练，换毛季每天梳毛，并使用牵引绳保障户外安全。",
  },
  {
    name: "贵宾犬", type: "犬类", trait: "聪明 · 活跃", age: "12–15 年", emoji: "🐩",
    bodySize: "中型", coatLength: "中长毛", activity: "较高", sheddingLevel: "较少",
    size: "小至中型犬", exercise: "中高", shedding: "很少", appetite: "中等", odor: "较轻",
    intro: "反应敏捷、学习速度快，喜欢互动和挑战。卷曲被毛掉毛少，但需要持续美容维护。",
    care: "每 4–6 周修剪被毛，搭配散步与益智训练，日常留意耳道、牙齿和泪痕清洁。",
  },
  {
    name: "暹罗猫", type: "猫类", trait: "亲人 · 爱交流", age: "12–16 年", emoji: "🐈",
    bodySize: "中型", coatLength: "短毛", activity: "较高", sheddingLevel: "较少",
    size: "中型猫", exercise: "中高", shedding: "较少", appetite: "中等", odor: "很轻",
    intro: "身形修长、重点色明显，喜欢用声音表达需求。它重视陪伴，也热衷探索与互动。",
    care: "每天安排逗猫和攀爬活动，避免长时间独处，并定期检查牙齿与保持稳定作息。",
  },
  {
    name: "缅因猫", type: "猫类", trait: "温柔 · 稳重", age: "12–15 年", emoji: "🐱",
    bodySize: "大型", coatLength: "长毛", activity: "适中", sheddingLevel: "较多",
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
  const [petSwipeDirection, setPetSwipeDirection] = useState<"left" | "right" | null>(null);
  const petSwipeRef = useRef<{ pointerId: number; startX: number; startY: number } | null>(null);
  const petSwipeConsumedRef = useRef(false);
  const petSwipeTimerRef = useRef<number | null>(null);
  const [checkInOpen, setCheckInOpen] = useState(true);
  const [checkedInPets, setCheckedInPets] = useState<string[]>([]);
  const [homeHealthRecords, setHomeHealthRecords] = useState<Record<string, { value: string; unit: string }>[]>(
    () => initialPetRecordData.map((record) => ({ ...record.health })),
  );
  const [openHealthChoice, setOpenHealthChoice] = useState<string | null>(null);
  const [tasks, setTasks] = useState(initialTasks);
  const [taskModal, setTaskModal] = useState(false);
  const [repeatMenuOpen, setRepeatMenuOpen] = useState(false);
  const [taskDraft, setTaskDraft] = useState({
    name: "",
    time: "08:00",
    repeat: "仅一次",
    intervalDays: "2",
    petNames: [initialPets[0].name],
    note: "",
  });
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [timePickerHour, setTimePickerHour] = useState("08");
  const [timePickerMinute, setTimePickerMinute] = useState("00");
  const hourWheelRef = useRef<HTMLDivElement>(null);
  const minuteWheelRef = useRef<HTMLDivElement>(null);
  const timeWheelDragRef = useRef<{
    element: HTMLDivElement;
    pointerId: number;
    startY: number;
    startScrollTop: number;
  } | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [recordPetPickerOpen, setRecordPetPickerOpen] = useState(false);
  const [recordDate, setRecordDate] = useState(new Date(2026, 6, 27));
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 6, 1));
  const [filter, setFilter] = useState("全部");
  const [wikiAllFilters, setWikiAllFilters] = useState<WikiAllFilters>(defaultWikiAllFilters);
  const [wikiFilterOpen, setWikiFilterOpen] = useState(false);
  const [wikiAllOpen, setWikiAllOpen] = useState(false);
  const [petCareGuideOpen, setPetCareGuideOpen] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
  const [breedCommentsOpen, setBreedCommentsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [petProfileOpen, setPetProfileOpen] = useState(false);
  const [petProfileSource, setPetProfileSource] = useState<"home" | "management">("home");
  const [petManagementOpen, setPetManagementOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [profileInfoOpen, setProfileInfoOpen] = useState(false);
  const [familyGroupOpen, setFamilyGroupOpen] = useState(false);
  const [inviteFamilyOpen, setInviteFamilyOpen] = useState(false);
  const [joinRequestsOpen, setJoinRequestsOpen] = useState(false);
  const [inviteCodeCopied, setInviteCodeCopied] = useState(false);
  const [invitePhone, setInvitePhone] = useState("");
  const [invitePhoneStatus, setInvitePhoneStatus] = useState<"idle" | "invalid" | "found" | "sent">("idle");
  const [profilePanel, setProfilePanel] = useState<"settings" | "help" | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [appSettings, setAppSettings] = useState({
    taskReminders: true,
  });
  const [healthCheckSettings, setHealthCheckSettings] = useState<HealthCheckSettings>({
    food: "g",
    water: "ml",
    walk: "分钟",
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

  useEffect(() => {
    if (!timePickerOpen) return;
    const frame = requestAnimationFrame(() => {
      hourWheelRef.current?.scrollTo({
        top: Number(timePickerHour) * taskTimeWheelItemHeight,
        behavior: "auto",
      });
      minuteWheelRef.current?.scrollTo({
        top: Number(timePickerMinute) * taskTimeWheelItemHeight,
        behavior: "auto",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [timePickerOpen]);
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
  const currentHomeHealth = homeHealthRecords[petIndex] ?? createDefaultPetRecord().health;
  const homeHealthItems = healthItems.map((item) => ({
    ...item,
    ...(currentHomeHealth[item.label] ?? {}),
  }));
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
  const filteredAllBreeds = useMemo(
    () =>
      breeds.filter(
        (breed) =>
          (wikiAllFilters.type === "全部" || breed.type === wikiAllFilters.type) &&
          (wikiAllFilters.bodySize === "全部" || breed.bodySize === wikiAllFilters.bodySize) &&
          (wikiAllFilters.coatLength === "全部" || breed.coatLength === wikiAllFilters.coatLength) &&
          (wikiAllFilters.activity === "全部" || breed.activity === wikiAllFilters.activity) &&
          (wikiAllFilters.sheddingLevel === "全部" || breed.sheddingLevel === wikiAllFilters.sheddingLevel) &&
          breed.name.includes(query.trim()),
      ),
    [query, wikiAllFilters],
  );
  const activeWikiAllFilterCount = Object.values(wikiAllFilters).filter((value) => value !== "全部").length;
  const breedComments = useMemo(() => {
    const breedName = selectedBreed?.name ?? "该品种";
    return [
      {
        avatar: "林",
        name: "林安",
        rating: "4.1",
        date: "今天",
        quality: true,
        content: "信息很实用，尤其是运动量和日常养护建议，准备养宠前更有底了。",
      },
      {
        avatar: "周",
        name: "周末养宠人",
        rating: "4.7",
        date: "昨天",
        quality: true,
        content: `我家的${breedName}也很符合这个性格描述，规律陪伴真的很重要。`,
      },
      {
        avatar: "陈",
        name: "陈晨",
        rating: "4.5",
        date: "3 天前",
        quality: false,
        content: `从幼年期开始养${breedName}，适应家庭生活很快，互动和训练建议都很有参考价值。`,
      },
      {
        avatar: "北",
        name: "北岛",
        rating: "4.3",
        date: "7 月 20 日",
        quality: false,
        content: "换毛期需要更勤快地梳毛，页面对掉毛程度和养护频率的说明比较准确。",
      },
      {
        avatar: "布",
        name: "一只布丁",
        rating: "4.6",
        date: "7 月 18 日",
        quality: false,
        content: "性格描述和我实际接触到的情况很接近，适合准备养宠时快速判断是否匹配。",
      },
      {
        avatar: "许",
        name: "老许养宠",
        rating: "4.2",
        date: "7 月 15 日",
        quality: false,
        content: "内容简洁清楚，如果能长期记录饮食、运动和体重变化，会更容易照顾好它。",
      },
    ];
  }, [selectedBreed]);

  const completeTask = (id: number) => {
    setTasks((items) => items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  const openTaskCreator = () => {
    setTaskDraft({
      name: "",
      time: "08:00",
      repeat: "仅一次",
      intervalDays: "2",
      petNames: [pet.name],
      note: "",
    });
    setRepeatMenuOpen(false);
    setTimePickerOpen(false);
    setTaskModal(true);
  };

  const openTaskTimePicker = () => {
    const [hour = "08", minute = "00"] = taskDraft.time.split(":");
    setTimePickerHour(hour.padStart(2, "0"));
    setTimePickerMinute(minute.padStart(2, "0"));
    setRepeatMenuOpen(false);
    setTimePickerOpen(true);
  };

  const startTimeWheelDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    timeWheelDragRef.current = {
      element: event.currentTarget,
      pointerId: event.pointerId,
      startY: event.clientY,
      startScrollTop: event.currentTarget.scrollTop,
    };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Some embedded WebViews do not expose pointer capture; dragging still
      // works because the wheel keeps handling pointer movement in place.
    }
  };

  const moveTimeWheelDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = timeWheelDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    drag.element.scrollTo({
      top: drag.startScrollTop - (event.clientY - drag.startY),
      behavior: "auto",
    });
  };

  const endTimeWheelDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = timeWheelDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const snappedTop = Math.round(drag.element.scrollTop / taskTimeWheelItemHeight) * taskTimeWheelItemHeight;
    drag.element.scrollTo({ top: snappedTop, behavior: "smooth" });
  if (drag.element.hasPointerCapture(event.pointerId)) {
    try {
      drag.element.releasePointerCapture(event.pointerId);
    } catch {
      // Ignore WebViews without pointer-capture support.
    }
    }
    timeWheelDragRef.current = null;
  };

  const saveTask = () => {
    const title = taskDraft.name.trim();
    if (!title || taskDraft.petNames.length === 0) return;
    const repeat = taskDraft.repeat === "每隔 N 天"
      ? `每 ${Math.max(1, Number(taskDraft.intervalDays) || 1)} 天`
      : taskDraft.repeat;
    setTasks((items) => [
      ...items,
      {
        id: Date.now(),
        time: taskDraft.time,
        title,
        note: taskDraft.note.trim() || `${repeat} · ${taskDraft.petNames.join("、")}`,
        done: false,
        icon: "📌",
        repeat,
        intervalDays: taskDraft.repeat === "每隔 N 天"
          ? Math.max(1, Number(taskDraft.intervalDays) || 1)
          : undefined,
        petNames: taskDraft.petNames,
      },
    ]);
    setTaskModal(false);
  };

  const updateHomeHealth = (label: string, value: string, unit: string) => {
    setHomeHealthRecords((records) => {
      const next = [...records];
      next[petIndex] = {
        ...(next[petIndex] ?? createDefaultPetRecord().health),
        [label]: { value, unit },
      };
      return next;
    });
  };

  const updateHealthCheckSetting = <Key extends keyof HealthCheckSettings>(
    key: Key,
    value: HealthCheckSettings[Key],
  ) => {
    if (healthCheckSettings[key] === value) return;
    setHealthCheckSettings((settings) => ({ ...settings, [key]: value }));

    const nextRecord = key === "food"
      ? { label: "食量", value: value === "状态" ? "正常" : "--", unit: value === "状态" ? "" : "g" }
      : key === "water"
        ? { label: "饮水", value: value === "状态" ? "正常" : "--", unit: value === "状态" ? "" : "ml" }
        : { label: "遛弯", value: "--", unit: value as string };

    setHomeHealthRecords((records) => records.map((record) => ({
      ...record,
      [nextRecord.label]: { value: nextRecord.value, unit: nextRecord.unit },
    })));
    setOpenHealthChoice(null);
  };

  const switchHomePet = (nextIndex: number, direction: "left" | "right") => {
    if (nextIndex === petIndex || petList.length < 2) return;
    if (petSwipeTimerRef.current !== null) {
      window.clearTimeout(petSwipeTimerRef.current);
    }
    setPetSwipeDirection(null);
    requestAnimationFrame(() => {
      setPetIndex(nextIndex);
      setPetSwipeDirection(direction);
      petSwipeTimerRef.current = window.setTimeout(() => {
        setPetSwipeDirection(null);
        petSwipeTimerRef.current = null;
      }, 280);
    });
  };

  const startPetSwipe = (event: ReactPointerEvent<HTMLElement>) => {
    if (petList.length < 2) return;
    petSwipeRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
  };

  const endPetSwipe = (event: ReactPointerEvent<HTMLElement>) => {
    const swipe = petSwipeRef.current;
    petSwipeRef.current = null;
    if (!swipe || swipe.pointerId !== event.pointerId || petList.length < 2) return;

    const deltaX = event.clientX - swipe.startX;
    const deltaY = event.clientY - swipe.startY;
    if (Math.abs(deltaX) < 46 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return;

    petSwipeConsumedRef.current = true;
    window.setTimeout(() => {
      petSwipeConsumedRef.current = false;
    }, 0);

    if (deltaX < 0) {
      switchHomePet((petIndex + 1) % petList.length, "left");
    } else {
      switchHomePet((petIndex - 1 + petList.length) % petList.length, "right");
    }
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
          {tab === "home" && taskModal && (
            <div className="task-create-view">
              <header className="task-create-header">
                <button type="button" onClick={() => setTaskModal(false)} aria-label="返回首页">
                  <ArrowLeft size={21} strokeWidth={1.7} aria-hidden="true" />
                </button>
                <h1>新增任务</h1>
                <span aria-hidden="true" />
              </header>

              <form
                className="task-create-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  saveTask();
                }}
              >
                <label className="task-form-row">
                  <span>任务名称</span>
                  <input
                    value={taskDraft.name}
                    onChange={(event) => setTaskDraft({ ...taskDraft, name: event.target.value })}
                    placeholder="请输入任务名称"
                    maxLength={20}
                    autoFocus
                  />
                </label>

                <label className="task-form-row">
                  <span>任务时间</span>
                  <button
                    type="button"
                    className="task-time-trigger"
                    aria-haspopup="dialog"
                    aria-expanded={timePickerOpen}
                    onClick={openTaskTimePicker}
                  >
                    <span>{taskDraft.time}</span>
                    <Clock3 size={16} strokeWidth={1.8} aria-hidden="true" />
                  </button>
                </label>

                <div className="task-form-row">
                  <span>重复</span>
                  <span className={`task-repeat-control ${taskDraft.repeat === "每隔 N 天" ? "custom" : ""}`}>
                    <button
                      type="button"
                      className="task-repeat-value"
                      aria-haspopup="listbox"
                      aria-expanded={repeatMenuOpen}
                      onClick={() => setRepeatMenuOpen((open) => !open)}
                    >
                      {taskDraft.repeat === "每隔 N 天" ? "每隔" : taskDraft.repeat}
                    </button>
                    {taskDraft.repeat === "每隔 N 天" && (
                      <>
                        <input
                          type="number"
                          inputMode="numeric"
                          min="1"
                          max="365"
                          value={taskDraft.intervalDays}
                          aria-label="间隔天数"
                          onChange={(event) => setTaskDraft({ ...taskDraft, intervalDays: event.target.value })}
                        />
                        <i>天</i>
                      </>
                    )}
                    <button
                      type="button"
                      className="task-repeat-toggle"
                      aria-label="选择重复规则"
                      aria-expanded={repeatMenuOpen}
                      onClick={() => setRepeatMenuOpen((open) => !open)}
                    >
                      <ChevronDown size={16} strokeWidth={1.8} aria-hidden="true" />
                    </button>
                    {repeatMenuOpen && (
                      <span className="task-repeat-menu" role="listbox" aria-label="重复规则">
                        {["仅一次", "每天", "每周", "每月", "每隔 N 天"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            role="option"
                            aria-selected={taskDraft.repeat === option}
                            className={taskDraft.repeat === option ? "selected" : ""}
                            onClick={() => {
                              setTaskDraft({ ...taskDraft, repeat: option });
                              setRepeatMenuOpen(false);
                            }}
                          >
                            <span>{option}</span>
                            {taskDraft.repeat === option && <Check size={13} strokeWidth={2.2} aria-hidden="true" />}
                          </button>
                        ))}
                      </span>
                    )}
                  </span>
                </div>

                <div className="task-form-row task-pet-field" role="group" aria-labelledby="task-pet-label">
                  <span id="task-pet-label">选择宠物</span>
                  <div className="task-pet-options">
                    {petList.map((item) => {
                      const selected = taskDraft.petNames.includes(item.name);
                      return (
                        <label key={item.name} className={selected ? "selected" : ""}>
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              setTaskDraft((draft) => ({
                                ...draft,
                                petNames: selected
                                  ? draft.petNames.filter((name) => name !== item.name)
                                  : [...draft.petNames, item.name],
                              }))
                            }
                          />
                          <span className="task-pet-check">{selected && <Check size={13} strokeWidth={2.4} aria-hidden="true" />}</span>
                          <span className="task-pet-avatar">
                            {"avatar" in item ? <img src={item.avatar} alt="" /> : <em>{item.emoji}</em>}
                          </span>
                          <strong>{item.name}</strong>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <label className="task-form-row task-note-row">
                  <span>备注</span>
                  <textarea
                    value={taskDraft.note}
                    onChange={(event) => setTaskDraft({ ...taskDraft, note: event.target.value })}
                    placeholder="补充任务内容（选填）"
                    maxLength={100}
                  />
                </label>

                <button
                  type="submit"
                  className="task-create-save"
                  disabled={!taskDraft.name.trim() || taskDraft.petNames.length === 0}
                >
                  保存
                </button>
              </form>

              {timePickerOpen && (
                <div className="task-time-backdrop" onMouseDown={() => setTimePickerOpen(false)}>
                  <section
                    className="task-time-dialog"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="task-time-title"
                    onMouseDown={(event) => event.stopPropagation()}
                  >
                    <header>
                      <button type="button" onClick={() => setTimePickerOpen(false)}>取消</button>
                      <strong id="task-time-title">选择时间</strong>
                      <button
                        type="button"
                        onClick={() => {
                          setTaskDraft({ ...taskDraft, time: `${timePickerHour}:${timePickerMinute}` });
                          setTimePickerOpen(false);
                        }}
                      >
                        确定
                      </button>
                    </header>
                    <div className="task-time-picker">
                      <div
                        className="task-time-wheel"
                        ref={hourWheelRef}
                        aria-label="小时"
                        onPointerDown={startTimeWheelDrag}
                        onPointerMove={moveTimeWheelDrag}
                        onPointerUp={endTimeWheelDrag}
                        onPointerCancel={endTimeWheelDrag}
                        onScroll={(event) => {
                          const index = Math.max(
                            0,
                            Math.min(
                              taskHours.length - 1,
                              Math.round(event.currentTarget.scrollTop / taskTimeWheelItemHeight),
                            ),
                          );
                          setTimePickerHour(taskHours[index]);
                        }}
                      >
                        {taskHours.map((hour) => (
                          <button
                            key={hour}
                            type="button"
                            className={timePickerHour === hour ? "selected" : ""}
                            onClick={() => {
                              setTimePickerHour(hour);
                              hourWheelRef.current?.scrollTo({
                                top: Number(hour) * taskTimeWheelItemHeight,
                                behavior: "smooth",
                              });
                            }}
                          >
                            {hour}<small>时</small>
                          </button>
                        ))}
                      </div>
                      <span className="task-time-separator">:</span>
                      <div
                        className="task-time-wheel"
                        ref={minuteWheelRef}
                        aria-label="分钟"
                        onPointerDown={startTimeWheelDrag}
                        onPointerMove={moveTimeWheelDrag}
                        onPointerUp={endTimeWheelDrag}
                        onPointerCancel={endTimeWheelDrag}
                        onScroll={(event) => {
                          const index = Math.max(
                            0,
                            Math.min(
                              taskMinutes.length - 1,
                              Math.round(event.currentTarget.scrollTop / taskTimeWheelItemHeight),
                            ),
                          );
                          setTimePickerMinute(taskMinutes[index]);
                        }}
                      >
                        {taskMinutes.map((minute) => (
                          <button
                            key={minute}
                            type="button"
                            className={timePickerMinute === minute ? "selected" : ""}
                            onClick={() => {
                              setTimePickerMinute(minute);
                              minuteWheelRef.current?.scrollTo({
                                top: Number(minute) * taskTimeWheelItemHeight,
                                behavior: "smooth",
                              });
                            }}
                          >
                            {minute}<small>分</small>
                          </button>
                        ))}
                      </div>
                    </div>
                    <p>上下滑动调整时间</p>
                  </section>
                </div>
              )}
            </div>
          )}

          {tab === "home" && !taskModal && !petProfileOpen && !petManagementOpen && !messagesOpen && (
            <div className="home-view">
              <section
                className={`pet-card ${pet.tone} ${petSwipeDirection ? `pet-swipe-${petSwipeDirection}` : ""}`}
                aria-label={`${pet.name}宠物卡，左右滑动切换宠物`}
                onPointerDown={startPetSwipe}
                onPointerUp={endPetSwipe}
                onPointerCancel={() => {
                  petSwipeRef.current = null;
                }}
                onClickCapture={(event) => {
                  if (!petSwipeConsumedRef.current) return;
                  event.preventDefault();
                  event.stopPropagation();
                  petSwipeConsumedRef.current = false;
                }}
              >
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
                      onClick={() => switchHomePet(index, index > petIndex ? "left" : "right")}
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
                      {homeHealthItems.map((item) => {
                        const HealthIcon = homeHealthIcons[item.label];
                        const statusOptions = item.label === "食量" && healthCheckSettings.food === "状态"
                          ? ["正常", "少", "多", "拒食"]
                          : item.label === "饮水" && healthCheckSettings.water === "状态"
                            ? ["正常", "少", "多", "未饮水"]
                            : item.label === "排便"
                              ? ["正常", "便秘", "腹泻", "未排便"]
                              : item.label === "精神"
                                ? ["正常", "活跃", "低迷", "暴躁"]
                                : null;
                        return (
                          <label
                            key={item.label}
                            className="health-item"
                          >
                            <span className="health-line-icon" aria-hidden="true">
                              <HealthIcon size={19} strokeWidth={1.8} />
                            </span>
                            <small>{item.label}</small>
                            {statusOptions ? (
                              <strong className="health-inline-choice">
                                <button
                                  type="button"
                                  className="health-inline-select"
                                  aria-label={`${item.label}状态`}
                                  aria-haspopup="listbox"
                                  aria-expanded={openHealthChoice === item.label}
                                  onClick={() => setOpenHealthChoice((current) => current === item.label ? null : item.label)}
                                >
                                  {statusOptions.includes(item.value) ? item.value : "请选择"}
                                </button>
                                {openHealthChoice === item.label && (
                                  <span className="health-choice-menu" role="listbox" aria-label={`${item.label}选项`}>
                                    {statusOptions.map((option) => (
                                      <button
                                        key={option}
                                        type="button"
                                        role="option"
                                        aria-selected={item.value === option}
                                        className={item.value === option ? "selected" : ""}
                                        onClick={() => {
                                          updateHomeHealth(item.label, option, item.unit);
                                          setOpenHealthChoice(null);
                                        }}
                                      >
                                        <span>{option}</span>
                                        {item.value === option && <Check size={13} strokeWidth={2.2} aria-hidden="true" />}
                                      </button>
                                    ))}
                                  </span>
                                )}
                              </strong>
                            ) : (
                              <strong className="health-inline-value">
                                <input
                                  type="number"
                                  inputMode="decimal"
                                  min="0"
                                  step={item.label === "体重" ? "0.1" : "1"}
                                  aria-label={`${item.label}数值`}
                                  value={item.value === "--" ? "" : item.value}
                                  placeholder="--"
                                  onChange={(event) => updateHomeHealth(item.label, event.target.value, item.unit)}
                                />
                                <i>{item.unit}</i>
                              </strong>
                            )}
                          </label>
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
                  <button className="add-task" onClick={openTaskCreator}>
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
                <h1 className="records-page-title">健康记录</h1>
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

          {tab === "wiki" && !wikiAllOpen && !selectedBreed && !petCareGuideOpen && (
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
                <div>
                  <small>新手必读</small>
                  <h2>新手养宠注意事项</h2>
                  <p>从物品准备到日常照护，开始养宠前先了解这些重点。</p>
                  <button
                    type="button"
                    onClick={() => {
                      setWikiFilterOpen(false);
                      setPetCareGuideOpen(true);
                    }}
                  >
                    查看完整指南 →
                  </button>
                </div>
                <span>🐾</span>
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
                    onClick={() => {
                      setBreedCommentsOpen(false);
                      setSelectedBreed(breed);
                    }}
                    aria-label={`查看${breed.name}百科详情`}
                  >
                    <div className="breed-art"><span>{breed.emoji}</span><small>{breed.type}</small></div>
                    <h3>{breed.name}</h3>
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

          {tab === "wiki" && petCareGuideOpen && !selectedBreed && (
            <div className="pet-care-guide-view">
              <header className="pet-profile-header">
                <button type="button" onClick={() => setPetCareGuideOpen(false)} aria-label="返回宠物百科">
                  <ArrowLeft size={20} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <div>
                  <small>新手养宠指南</small>
                  <h1>养宠注意事项</h1>
                </div>
              </header>

              <section className="pet-care-guide-hero">
                <div>
                  <small>开始养宠前，请认真读完</small>
                  <h2>让陪伴从充分准备开始</h2>
                  <p>从选择宠物、准备用品到饮食、清洁和健康管理，提前了解每一项责任。</p>
                </div>
                <span aria-hidden="true">🐾</span>
              </section>

              <section className="pet-care-guide-content" aria-label="养宠注意事项正文">
                {petCareGuideSections.map((section, index) => (
                  <article key={section.title}>
                    <header>
                      <span aria-hidden="true">{section.icon}</span>
                      <div>
                        <small>{String(index + 1).padStart(2, "0")}</small>
                        <h2>{section.title}</h2>
                      </div>
                    </header>
                    <div>
                      {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                  </article>
                ))}
              </section>

              <aside className="pet-care-guide-note">
                <span><ShieldCheck size={20} strokeWidth={1.8} aria-hidden="true" /></span>
                <p>
                  <strong>健康问题请及时咨询专业宠物医生</strong>
                  本指南用于日常养宠准备与基础照护参考，不能替代专业诊断和治疗。
                </p>
              </aside>
            </div>
          )}

          {wikiAllOpen && !selectedBreed && (
            <div className="wiki-all-view">
              <header className="pet-profile-header">
                <button
                  type="button"
                  onClick={() => {
                    setWikiFilterOpen(false);
                    setWikiAllOpen(false);
                  }}
                  aria-label="返回宠物百科"
                >
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
                <span>共 {filteredAllBreeds.length} 个品种</span>
                <div className="wiki-filter">
                  <button
                    type="button"
                    className={`wiki-filter-trigger ${activeWikiAllFilterCount ? "active" : ""}`}
                    onClick={() => setWikiFilterOpen(!wikiFilterOpen)}
                    aria-expanded={wikiFilterOpen}
                  >
                    <ListFilter size={15} strokeWidth={1.8} aria-hidden="true" />
                    筛选
                    {!!activeWikiAllFilterCount && (
                      <span className="wiki-filter-count">{activeWikiAllFilterCount}</span>
                    )}
                    <ChevronDown size={14} strokeWidth={1.8} aria-hidden="true" />
                  </button>
                  {wikiFilterOpen && (
                    <div className="wiki-all-filter-menu" aria-label="品种筛选条件">
                      <header>
                        <div>
                          <small>按饲养需求查找</small>
                          <strong>筛选品种</strong>
                        </div>
                        <button type="button" onClick={() => setWikiFilterOpen(false)} aria-label="关闭筛选">
                          ×
                        </button>
                      </header>
                      <div className="wiki-all-filter-groups">
                        {wikiAllFilterGroups.map((group) => (
                          <section key={group.key}>
                            <strong>{group.label}</strong>
                            <div>
                              {group.options.map((option) => {
                                const selected = wikiAllFilters[group.key] === option.value;
                                return (
                                  <button
                                    type="button"
                                    className={selected ? "active" : ""}
                                    key={option.value}
                                    onClick={() =>
                                      setWikiAllFilters((current) => ({
                                        ...current,
                                        [group.key]: option.value,
                                      }) as WikiAllFilters)
                                    }
                                  >
                                    {option.label}
                                  </button>
                                );
                              })}
                            </div>
                          </section>
                        ))}
                      </div>
                      <footer>
                        <button type="button" onClick={() => setWikiAllFilters(defaultWikiAllFilters)}>
                          重置
                        </button>
                        <button type="button" onClick={() => setWikiFilterOpen(false)}>
                          查看 {filteredAllBreeds.length} 个品种
                        </button>
                      </footer>
                    </div>
                  )}
                </div>
              </div>

              <section className="breed-grid wiki-all-grid">
                {filteredAllBreeds.map((breed) => (
                  <button
                    type="button"
                    className="breed-card"
                    key={breed.name}
                    onClick={() => {
                      setBreedCommentsOpen(false);
                      setSelectedBreed(breed);
                    }}
                    aria-label={`查看${breed.name}百科详情`}
                  >
                    <div className="breed-art"><span>{breed.emoji}</span><small>{breed.type}</small></div>
                    <h3>{breed.name}</h3>
                    <p>{breed.trait}</p>
                    <footer><span>平均寿命</span><strong>{breed.age}</strong></footer>
                  </button>
                ))}
              </section>
              {!filteredAllBreeds.length && <div className="empty-state"><span>🐾</span><p>没有找到相关品种</p></div>}
            </div>
          )}

          {selectedBreed && !breedCommentsOpen && (
            <div className="breed-detail-view">
              <header className="pet-profile-header">
                <button
                  type="button"
                  onClick={() => {
                    setBreedCommentsOpen(false);
                    setSelectedBreed(null);
                  }}
                  aria-label="返回品种列表"
                >
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
                  <div><small>品种信息</small></div>
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
                  <div className="breed-overall-rating">
                    <span><small>综合评分</small><strong>4.4/5</strong></span>
                  </div>
                </div>
                <article>
                  <span>林</span>
                  <div>
                    <div className="breed-comment-meta">
                      <div className="breed-comment-author">
                        <strong>林安</strong>
                        <span className="breed-comment-quality">
                          <Sparkles size={9} strokeWidth={2} aria-hidden="true" />
                          优质评论
                        </span>
                      </div>
                      <em className="breed-comment-rating">4.1/5</em>
                    </div>
                    <p>信息很实用，尤其是运动量和日常养护建议，准备养宠前更有底了。</p>
                  </div>
                </article>
                <article>
                  <span>周</span>
                  <div>
                    <div className="breed-comment-meta">
                      <div className="breed-comment-author">
                        <strong>周末养宠人</strong>
                        <span className="breed-comment-quality">
                          <Sparkles size={9} strokeWidth={2} aria-hidden="true" />
                          优质评论
                        </span>
                      </div>
                      <em className="breed-comment-rating">4.7/5</em>
                    </div>
                    <p>我家的{selectedBreed.name}也很符合这个性格描述，规律陪伴真的很重要。</p>
                  </div>
                </article>
                <button type="button" onClick={() => setBreedCommentsOpen(true)}>
                  <span>全部评论</span>
                  <ChevronRight size={14} strokeWidth={1.9} aria-hidden="true" />
                </button>
              </section>
            </div>
          )}

          {selectedBreed && breedCommentsOpen && (
            <div className="breed-comments-view">
              <header className="pet-profile-header">
                <button type="button" onClick={() => setBreedCommentsOpen(false)} aria-label="返回品种详情">
                  <ArrowLeft size={20} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <div>
                  <small>{selectedBreed.name}</small>
                </div>
              </header>

              <section className="breed-comments-summary">
                <div className="breed-comments-score">
                  <small>综合评分</small>
                  <p><strong>4.4</strong><span>/5</span></p>
                </div>
                <div className="breed-comments-metrics">
                  <div><span>描述吻合</span><strong>4.6</strong></div>
                  <div><span>养护参考</span><strong>4.4</strong></div>
                  <div><span>家庭适配</span><strong>4.3</strong></div>
                </div>
              </section>

              <div className="breed-comments-toolbar">
                <div><h2>全部评论</h2></div>
                <span>按时间排序</span>
              </div>

              <section className="breed-all-comments">
                {breedComments.map((comment) => (
                  <article key={`${comment.name}-${comment.date}`}>
                    <span className="breed-all-comment-avatar">{comment.avatar}</span>
                    <div className="breed-all-comment-content">
                      <header>
                        <div>
                          <p className="breed-comment-author">
                            <strong>{comment.name}</strong>
                            {comment.quality && (
                              <span className="breed-comment-quality">
                                <Sparkles size={9} strokeWidth={2} aria-hidden="true" />
                                优质评论
                              </span>
                            )}
                          </p>
                          <small>{comment.date}</small>
                        </div>
                        <em className="breed-comment-rating">{comment.rating}/5</em>
                      </header>
                      <p>{comment.content}</p>
                    </div>
                  </article>
                ))}
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

              <button type="button" className="logout-button" onClick={() => setLogoutConfirmOpen(true)}>
                <LogOut size={17} strokeWidth={1.8} aria-hidden="true" />
                退出登录
              </button>
            </div>
          )}

          {tab === "profile" && familyGroupOpen && !inviteFamilyOpen && !joinRequestsOpen && !messagesOpen && (
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

              <button
                type="button"
                className="invite-family-button"
                onClick={() => {
                  setInviteCodeCopied(false);
                  setInvitePhone("");
                  setInvitePhoneStatus("idle");
                  setJoinRequestsOpen(false);
                  setInviteFamilyOpen(true);
                }}
              >
                <span><UserPlus size={19} strokeWidth={1.8} aria-hidden="true" /></span>
                <p><strong>邀请新成员</strong><small>分享邀请，让家人一起参与照顾</small></p>
                <ChevronRight size={17} strokeWidth={1.8} aria-hidden="true" />
              </button>

              <section className="family-group-actions">
                <button
                  type="button"
                  onClick={() => {
                    setInviteFamilyOpen(false);
                    setJoinRequestsOpen(true);
                  }}
                >
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

          {tab === "profile" && familyGroupOpen && joinRequestsOpen && !messagesOpen && (
            <div className="family-requests-view">
              <header className="pet-profile-header">
                <button type="button" onClick={() => setJoinRequestsOpen(false)} aria-label="返回家庭组">
                  <ArrowLeft size={20} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <div>
                  <small>成员管理</small>
                  <h1>加入申请</h1>
                </div>
              </header>

              <section className="family-requests-pending">
                <div className="family-invite-section-heading">
                  <div><small>待处理</small><h2>新的加入申请</h2></div>
                  <em>0 条</em>
                </div>
                <div className="family-requests-empty">
                  <span><UserRound size={24} strokeWidth={1.6} aria-hidden="true" /></span>
                  <strong>暂无待处理申请</strong>
                  <p>家人通过邀请码申请加入后，会显示在这里。</p>
                </div>
              </section>

              <section className="family-requests-history">
                <div className="family-invite-section-heading">
                  <div><small>最近处理</small><h2>申请记录</h2></div>
                </div>
                {[
                  ["顾", "顾乔", "已同意", "2026.07.18"],
                  ["何", "何清", "已拒绝", "2026.07.08"],
                ].map(([avatar, name, status, date]) => (
                  <article key={name}>
                    <span>{avatar}</span>
                    <p><strong>{name}</strong><small>{date}</small></p>
                    <em className={status === "已同意" ? "approved" : ""}>
                      {status === "已同意" && <Check size={12} strokeWidth={2} aria-hidden="true" />}
                      {status}
                    </em>
                  </article>
                ))}
              </section>
            </div>
          )}

          {tab === "profile" && familyGroupOpen && inviteFamilyOpen && !messagesOpen && (
            <div className="family-invite-view">
              <header className="pet-profile-header">
                <button type="button" onClick={() => setInviteFamilyOpen(false)} aria-label="返回家庭组">
                  <ArrowLeft size={20} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <div>
                  <small>共同陪伴</small>
                  <h1>邀请新成员</h1>
                </div>
              </header>

              <section className="family-phone-invite-card">
                <div className="family-invite-section-heading">
                  <div><small>直接查找</small><h2>通过手机号邀请</h2></div>
                  <span><Smartphone size={18} strokeWidth={1.8} aria-hidden="true" /></span>
                </div>
                <p className="family-phone-invite-tip">输入对方绑定宠物健康助手的手机号，搜索账号并发送家庭邀请。</p>
                <div className="family-phone-search">
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={11}
                    placeholder="请输入 11 位手机号"
                    value={invitePhone}
                    onChange={(event) => {
                      setInvitePhone(event.target.value.replace(/\D/g, "").slice(0, 11));
                      setInvitePhoneStatus("idle");
                    }}
                    aria-label="目标用户绑定的手机号"
                  />
                  <button
                    type="button"
                    onClick={() => setInvitePhoneStatus(/^1\d{10}$/.test(invitePhone) ? "found" : "invalid")}
                  >
                    <Search size={16} strokeWidth={1.9} aria-hidden="true" />
                    搜索
                  </button>
                </div>
                {invitePhoneStatus === "invalid" && (
                  <p className="family-phone-error">请输入正确的 11 位手机号</p>
                )}
                {(invitePhoneStatus === "found" || invitePhoneStatus === "sent") && (
                  <article className="family-phone-result">
                    <span>许</span>
                    <p>
                      <strong>许言</strong>
                      <small>{invitePhone.slice(0, 3)} **** {invitePhone.slice(-4)}</small>
                    </p>
                    <button
                      type="button"
                      disabled={invitePhoneStatus === "sent"}
                      onClick={() => setInvitePhoneStatus("sent")}
                    >
                      {invitePhoneStatus === "sent" ? (
                        <><Check size={14} strokeWidth={2} aria-hidden="true" />已邀请</>
                      ) : (
                        <><UserPlus size={14} strokeWidth={1.9} aria-hidden="true" />邀请</>
                      )}
                    </button>
                  </article>
                )}
              </section>

              <section className="family-invite-code-card">
                <div className="family-invite-section-heading">
                  <div><small>专属凭证</small><h2>家庭邀请码</h2></div>
                  <em>24 小时有效</em>
                </div>
                <div className="family-invite-code">PAW-8264</div>
                <p>加入“林安的家庭组”</p>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText("PAW-8264");
                    setInviteCodeCopied(true);
                  }}
                >
                  {inviteCodeCopied ? (
                    <><Check size={16} strokeWidth={2} aria-hidden="true" />邀请码已复制</>
                  ) : (
                    <><ClipboardList size={16} strokeWidth={1.8} aria-hidden="true" />复制邀请码</>
                  )}
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

              <section className="settings-group health-check-settings">
                <div className="secondary-section-title">
                  <small>健康记录</small>
                  <h2>打卡记录方式</h2>
                </div>
                {([
                  {
                    key: "food",
                    Icon: Utensils,
                    label: "食量",
                    detail: "精确克数或大概状态",
                    options: ["g", "状态"],
                  },
                  {
                    key: "water",
                    Icon: Droplets,
                    label: "饮水",
                    detail: "精确毫升或大概状态",
                    options: ["ml", "状态"],
                  },
                  {
                    key: "walk",
                    Icon: Footprints,
                    label: "遛弯",
                    detail: "按时长或距离记录",
                    options: ["分钟", "公里"],
                  },
                ] as const).map(({ key, Icon, label, detail, options }) => (
                  <div className="health-setting-item" key={key}>
                    <span><Icon size={18} strokeWidth={1.8} aria-hidden="true" /></span>
                    <p><strong>{label}</strong><small>{detail}</small></p>
                    <div className="health-setting-options" role="radiogroup" aria-label={`${label}记录方式`}>
                      {options.map((option) => (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={healthCheckSettings[key] === option}
                          className={healthCheckSettings[key] === option ? "active" : ""}
                          key={option}
                          onClick={() => updateHealthCheckSetting(key, option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <p className="health-setting-note">切换后，首页健康打卡将按所选方式填写。</p>
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
                  <div><h2>{accountProfile.name}</h2></div>
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
                <div className="section-heading compact"><div><h2>家庭组</h2></div><button type="button" onClick={() => setFamilyGroupOpen(true)}>管理 ›</button></div>
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

        {!taskModal && !petProfileOpen && !petManagementOpen && !messagesOpen && !profileInfoOpen && !familyGroupOpen && !profilePanel && !wikiAllOpen && !petCareGuideOpen && !selectedBreed && <nav className={`tab-bar${tab === "profile" ? " profile-tab-bar" : ""}`}>
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
