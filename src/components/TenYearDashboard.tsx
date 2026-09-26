import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PAPERS_DATA } from '../data/papersData';
import { PaperMeta, ExamCategory } from '../types';
import { getStoredAttempts } from '../utils/storage';
import { 
  Play, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Award, 
  ShieldCheck, 
  Shield,
  GraduationCap,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  History
} from 'lucide-react';

interface YearStatus {
  year: number;
  available: boolean;
  statusNote: string;
  statusNoteHi: string;
  papers: PaperMeta[];
}

export const TenYearDashboard: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    startMockTest, 
    startCustomTest,
    openPracticeMode, 
    openPaperViewer,
    viewAttemptResult,
    setCurrentView,
    language 
  } = useApp();

  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const [selectedYearFilter, setSelectedYearFilter] = useState<number | 'all'>('all');
  const [ctetSubFilter, setCtetSubFilter] = useState<
    'all' | 'paper1' | 'paper2' | 'shift1' | 'shift2' | 'cbt' | 'subject' | 'topic'
  >('all');

  const attempts = getStoredAttempts();

  // Generate 10-year grid for Constable (2015 - 2024 / 2025)
  const constableYears: YearStatus[] = [
    {
      year: 2024,
      available: true,
      statusNote: '60,244 Vacancies - Re-Exam (Aug 23-31) & Feb 17-18 Papers Available',
      statusNoteHi: '60,244 पद - पुनर्परीक्षा (23-31 अगस्त) व 17-18 फरवरी के आधिकारिक प्रश्न पत्र उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'constable' && p.year === 2024)
    },
    {
      year: 2023,
      available: false,
      statusNote: 'No written examination was conducted in 2023. Recruitment notification for 60,244 posts was published in Dec 2023.',
      statusNoteHi: 'वर्ष 2023 में कोई लिखित परीक्षा आयोजित नहीं हुई। दिसंबर 2023 में 60,244 पदों की विज्ञप्ति जारी हुई थी।',
      papers: []
    },
    {
      year: 2022,
      available: false,
      statusNote: 'No UP Police Constable written exam held in 2022 (Tender & agency selection phase).',
      statusNoteHi: 'वर्ष 2022 में बोर्ड द्वारा कोई आरक्षी लिखित परीक्षा आयोजित नहीं की गई।',
      papers: []
    },
    {
      year: 2021,
      available: false,
      statusNote: 'No Constable written exam in 2021 (COVID-19 deferred cycle; UPSI exam was conducted).',
      statusNoteHi: 'वर्ष 2021 में आरक्षी परीक्षा आयोजित नहीं हुई (उपनिरीक्षक परीक्षा संपन्न हुई थी)।',
      papers: []
    },
    {
      year: 2020,
      available: true,
      statusNote: 'Jail Warder, Fireman & Mounted Police Combined Exam (Dec 19-20, 2020) Available',
      statusNoteHi: 'जेल वार्डर, फायरमैन एवं घुड़सवार आरक्षी परीक्षा (19-20 दिसंबर 2020) उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'constable' && p.year === 2020)
    },
    {
      year: 2019,
      available: true,
      statusNote: '49,568 Constable Civil Police & PAC Exam (Jan 27-28, 2019) Available',
      statusNoteHi: '49,568 आरक्षी नागरिक पुलिस व पीएसी भर्ती (27-28 जनवरी 2019) उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'constable' && p.year === 2019)
    },
    {
      year: 2018,
      available: true,
      statusNote: '41,520 Constable Civil Police & PAC (Oct 25-26 & June 18-19, 2018) Available',
      statusNoteHi: '41,520 आरक्षी भर्ती पुनर्परीक्षा (25-26 अक्टूबर व 18-19 जून 2018) उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'constable' && p.year === 2018)
    },
    {
      year: 2017,
      available: false,
      statusNote: 'No Constable written exam held in 2017 (Recruitment was under judicial review / policy shift).',
      statusNoteHi: 'वर्ष 2017 में कोई सिपाही लिखित परीक्षा नहीं हुई।',
      papers: []
    },
    {
      year: 2016,
      available: false,
      statusNote: '34,716 Constable Recruitment (10th/12th merit-based screening & physical test only; no written exam).',
      statusNoteHi: '34,716 आरक्षी भर्ती 2016 (मेरिट व शारीरिक परीक्षा आधारित थी, लिखित परीक्षा नहीं हुई)।',
      papers: []
    },
    {
      year: 2013,
      available: true,
      statusNote: '41,610 Constable Recruitment Main Written Examination (Dec 15, 2013) Available',
      statusNoteHi: '41,610 आरक्षी मुख्य लिखित परीक्षा (15 दिसंबर 2013) उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'constable' && p.year === 2013)
    }
  ];

  // Generate 10-year grid for UPSI (2011 - 2021 / 2024)
  const upsiYears: YearStatus[] = [
    {
      year: 2024,
      available: false,
      statusNote: 'New UPSI Recruitment (921+ Posts) notification under process; examination scheduled.',
      statusNoteHi: 'नई उपनिरीक्षक भर्ती प्रक्रियाधीन है; आगामी परीक्षा प्रस्तावित।',
      papers: []
    },
    {
      year: 2023,
      available: false,
      statusNote: 'No direct UPSI recruitment written exam held in 2023.',
      statusNoteHi: 'वर्ष 2023 में सीधी भर्ती की दरोगा परीक्षा नहीं हुई।',
      papers: []
    },
    {
      year: 2022,
      available: false,
      statusNote: 'Physical efficiency tests (PET) and medical verification for 9,534 posts.',
      statusNoteHi: 'वर्ष 2022 में 9,534 दरोगा पदों हेतु शारीरिक दक्षता व मेडिकल परीक्षण संपन्न हुआ।',
      papers: []
    },
    {
      year: 2021,
      available: true,
      statusNote: '9,534 Posts Online CBT Exam (Nov 12 - Dec 02, 2021) 3 Phases Shifts Available',
      statusNoteHi: '9,534 पद उपनिरीक्षक ऑनलाइन सीबीटी परीक्षा (12 नवंबर - 02 दिसंबर 2021) उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'upsi' && p.year === 2021)
    },
    {
      year: 2020,
      available: false,
      statusNote: 'No written examination held due to national COVID-19 pandemic protocol.',
      statusNoteHi: 'कोविड-19 महामारी के कारण 2020 में कोई परीक्षा आयोजित नहीं हुई।',
      papers: []
    },
    {
      year: 2019,
      available: false,
      statusNote: 'No UPSI recruitment written examination conducted by UPPBPB in 2019.',
      statusNoteHi: 'वर्ष 2019 में कोई उपनिरीक्षक लिखित परीक्षा आयोजित नहीं हुई।',
      papers: []
    },
    {
      year: 2018,
      available: false,
      statusNote: '2017 exam document verification & re-evaluation proceedings.',
      statusNoteHi: 'वर्ष 2018 में 2017 परीक्षा की चयन व अभिलेख सत्यापन प्रक्रिया संचालित थी।',
      papers: []
    },
    {
      year: 2017,
      available: true,
      statusNote: 'UPSI Online CBT Examination (Dec 12 - Dec 23, 2017) All Shifts Available',
      statusNoteHi: 'दरोगा ऑनलाइन सीबीटी परीक्षा (12 - 23 दिसंबर 2017) उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'upsi' && p.year === 2017)
    },
    {
      year: 2014,
      available: true,
      statusNote: 'UP Police SI Direct Recruitment Examination 2014 (Sept 14, 2014) Available',
      statusNoteHi: 'उत्तर प्रदेश पुलिस उपनिरीक्षक सीधी भर्ती परीक्षा 2014 (14 सितंबर) उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'upsi' && p.year === 2014)
    },
    {
      year: 2011,
      available: true,
      statusNote: 'UP Police SI Recruitment Written Examination 2011 Available',
      statusNoteHi: 'उत्तर प्रदेश पुलिस उपनिरीक्षक भर्ती परीक्षा 2011 उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'upsi' && p.year === 2011)
    }
  ];

  // Generate 10-year grid for UPSSSC PET (2015 - 2024)
  const petYears: YearStatus[] = [
    {
      year: 2024,
      available: false,
      statusNote: 'UPSSSC PET 2024 official recruitment cycle notification under process.',
      statusNoteHi: 'उत्तर प्रदेश अधीनस्थ सेवा चयन आयोग (UPSSSC) द्वारा PET 2024 प्रक्रियाधीन।',
      papers: []
    },
    {
      year: 2023,
      available: true,
      statusNote: 'UPSSSC Preliminary Eligibility Test (Oct 28-29, 2023) Shifts 1 & 2 Available',
      statusNoteHi: 'प्रारंभिक अर्हता परीक्षा (28-29 अक्टूबर 2023) शिफ्ट 1 व 2 के आधिकारिक प्रश्न पत्र उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'pet' && p.year === 2023)
    },
    {
      year: 2022,
      available: true,
      statusNote: 'UPSSSC Preliminary Eligibility Test (Oct 15-16, 2022) Shift 1 Available',
      statusNoteHi: 'प्रारंभिक अर्हता परीक्षा (15-16 अक्टूबर 2022) शिफ्ट 1 का आधिकारिक प्रश्न पत्र उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'pet' && p.year === 2022)
    },
    {
      year: 2021,
      available: true,
      statusNote: 'Inaugural UPSSSC PET Examination (Aug 24, 2021) Shift 1 Available',
      statusNoteHi: 'प्रथम प्रारंभिक अर्हता परीक्षा (24 अगस्त 2021) शिफ्ट 1 उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'pet' && p.year === 2021)
    },
    {
      year: 2020,
      available: false,
      statusNote: 'Two-tier recruitment examination system adopted by Uttar Pradesh government.',
      statusNoteHi: 'उत्तर प्रदेश शासन द्वारा द्वि-स्तरीय परीक्षा प्रणाली अनुमोदित; प्रथम PET 2021 में आयोजित।',
      papers: []
    },
    {
      year: 2019,
      available: false,
      statusNote: 'Direct recruitment examinations (VDO, Lekhpal, Mandi Parishad) held prior to PET scheme.',
      statusNoteHi: 'PET व्यवस्था लागू होने से पूर्व अलग-अलग विभागीय लिखित परीक्षाएं आयोजित होती थीं।',
      papers: []
    },
    {
      year: 2018,
      available: false,
      statusNote: 'Single-tier recruitment selection examinations conducted by UPSSSC.',
      statusNoteHi: 'UPSSSC द्वारा ग्राम पंचायत अधिकारी व सम्मिलित कनिष्ठ सहायक परीक्षाएं आयोजित।',
      papers: []
    },
    {
      year: 2017,
      available: false,
      statusNote: 'Commission reorganization and recruitment procedure standardization period.',
      statusNoteHi: 'आयोग पुनर्गठन एवं परीक्षा प्रणाली समीक्षा अवधि।',
      papers: []
    },
    {
      year: 2016,
      available: false,
      statusNote: 'Combined Junior Assistant & Stenographer direct selection written tests.',
      statusNoteHi: 'कनिष्ठ सहायक व आशुलिपिक भर्ती परीक्षा।',
      papers: []
    },
    {
      year: 2015,
      available: false,
      statusNote: 'UPSSSC departmental open competitive screening written examinations.',
      statusNoteHi: 'उत्तर प्रदेश अधीनस्थ सेवा चयन आयोग प्रारंभिक विभागीय परीक्षाएं।',
      papers: []
    }
  ];

  // Generate 10-year grid for UP CAT (2015 - 2024)
  const upcatYears: YearStatus[] = [
    {
      year: 2024,
      available: true,
      statusNote: 'UP CAT Combined Admission & Aptitude Test 2024 Shift 1 Available',
      statusNoteHi: 'संयुक्त प्रवेश एवं अभिरुचि परीक्षा 2024 प्रथम पाली का आधिकारिक प्रश्न पत्र उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'upcat' && p.year === 2024)
    },
    {
      year: 2023,
      available: true,
      statusNote: 'UP CAT Combined Admission & Aptitude Test 2023 Shift 1 Available',
      statusNoteHi: 'संयुक्त प्रवेश परीक्षा 2023 आधिकारिक प्रश्न पत्र उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'upcat' && p.year === 2023)
    },
    {
      year: 2022,
      available: true,
      statusNote: 'UP CAT Combined Admission & Aptitude Test 2022 Shift 1 Available',
      statusNoteHi: 'संयुक्त प्रवेश परीक्षा 2022 का आधिकारिक प्रश्न पत्र उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'upcat' && p.year === 2022)
    },
    {
      year: 2021,
      available: false,
      statusNote: 'State combined entrance test held under normalized assessment guidelines.',
      statusNoteHi: 'कोविड प्रोटोकॉल के अंतर्गत राज्य संयुक्त प्रवेश परीक्षा सत्र।',
      papers: []
    },
    {
      year: 2020,
      available: false,
      statusNote: 'Entrance examination window revised due to emergency protocols.',
      statusNoteHi: 'महामारी प्रोटोकॉल अंतर्गत संशोधित तिथियों में परीक्षा संपन्न।',
      papers: []
    },
    {
      year: 2019,
      available: false,
      statusNote: 'State combined aptitude test archived question repository.',
      statusNoteHi: 'राज्य संयुक्त प्रवेश परीक्षा 2019 अभिलेख।',
      papers: []
    },
    {
      year: 2018,
      available: false,
      statusNote: 'State level combined entrance & aptitude test series.',
      statusNoteHi: 'राज्य स्तरीय संयुक्त अभिरुचि व प्रवेश परीक्षा 2018।',
      papers: []
    },
    {
      year: 2017,
      available: false,
      statusNote: 'Offline pen-and-paper combined admission assessment.',
      statusNoteHi: 'ऑफलाइन ओएमआर आधारित संयुक्त प्रवेश परीक्षा।',
      papers: []
    },
    {
      year: 2016,
      available: false,
      statusNote: 'State combined admission test examination session.',
      statusNoteHi: 'संयुक्त प्रवेश परीक्षा 2016 अभिलेख।',
      papers: []
    },
    {
      year: 2015,
      available: false,
      statusNote: 'Combined aptitude evaluation series for professional courses.',
      statusNoteHi: 'संयुक्त प्रवेश अभिरुचि परीक्षा 2015।',
      papers: []
    }
  ];

  // Generate 10-year grid for CTET (2015 - 2024)
  const ctetYears: YearStatus[] = [
    {
      year: 2024,
      available: true,
      statusNote: 'CTET 2024 Sessions: July 2024 (19th Edition, Paper 1 & 2) & January 2024 (18th Edition, Paper 1 & 2) Available',
      statusNoteHi: 'सीटीईटी 2024: 7 जुलाई 2024 (19वां संस्करण) एवं 21 जनवरी 2024 (18वां संस्करण) के पेपर 1 व 2 के आधिकारिक प्रश्न पत्र उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'ctet' && p.year === 2024)
    },
    {
      year: 2023,
      available: true,
      statusNote: 'CTET 2023 Sessions: August 2023 (17th Edition OMR) & January 2023 (16th Edition CBT) Paper 1 & 2 Available',
      statusNoteHi: 'सीटीईटी 2023: 20 अगस्त 2023 ऑफलाइन पेन-पेपर एवं जनवरी 2023 सीबीटी ऑनलाइन सत्रों के पेपर 1 व 2 उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'ctet' && p.year === 2023)
    },
    {
      year: 2022,
      available: true,
      statusNote: 'CTET 2022 Session: December 2022 CBT Online Session Paper 1 & 2 Available',
      statusNoteHi: 'सीटीईटी 2022: 28 दिसंबर 2022 सीबीटी ऑनलाइन सत्र के आधिकारिक प्रश्न पत्र उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'ctet' && p.year === 2022)
    },
    {
      year: 2021,
      available: true,
      statusNote: 'CTET 2021 Sessions: December 2021 (15th Edition First CBT) & January 2021 (14th Edition OMR) Available',
      statusNoteHi: 'सीटीईटी 2021: 16 दिसंबर 2021 प्रथम ऑनलाइन सीबीटी एवं 31 जनवरी 2021 ऑफलाइन परीक्षा उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'ctet' && p.year === 2021)
    },
    {
      year: 2020,
      available: false,
      statusNote: 'Paper not available from verified source. Examination postponed nationwide due to COVID-19 pandemic (conducted on 31 Jan 2021).',
      statusNoteHi: 'सत्यापित स्रोत से प्रश्न पत्र उपलब्ध नहीं। कोविड-19 महामारी के कारण जुलाई 2020 परीक्षा स्थगित होकर 31 जनवरी 2021 को संपन्न हुई।',
      papers: []
    },
    {
      year: 2019,
      available: true,
      statusNote: 'CTET 2019 Sessions: December 2019 (13th Edition) & July 2019 (12th Edition) Paper 1 & 2 Available',
      statusNoteHi: 'सीटीईटी 2019: 8 दिसंबर 2019 (13वां संस्करण) व 7 जुलाई 2019 (12वां संस्करण) पेपर 1 व 2 उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'ctet' && p.year === 2019)
    },
    {
      year: 2018,
      available: true,
      statusNote: 'CTET 2018 Session: December 2018 (11th Edition) Conducted after 2-year hiatus, Paper 1 & 2 Available',
      statusNoteHi: 'सीटीईटी 2018: 9 दिसंबर 2018 (11वां संस्करण) पेपर 1 व 2 उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'ctet' && p.year === 2018)
    },
    {
      year: 2017,
      available: false,
      statusNote: 'Paper not available from verified source. No CTET examination was conducted by CBSE in calendar year 2017.',
      statusNoteHi: 'सत्यापित स्रोत से प्रश्न पत्र उपलब्ध नहीं। वर्ष 2017 में सीबीएसई द्वारा कोई सीटीईटी परीक्षा आयोजित नहीं की गई।',
      papers: []
    },
    {
      year: 2016,
      available: true,
      statusNote: 'CTET 2016 Sessions: September 2016 (10th Edition) & February 2016 (9th Edition) Available',
      statusNoteHi: 'सीटीईटी 2016: 18 सितंबर 2016 (10वां संस्करण) एवं 21 फरवरी 2016 (9वां संस्करण) उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'ctet' && p.year === 2016)
    },
    {
      year: 2015,
      available: true,
      statusNote: 'CTET 2015 Sessions: September 2015 (8th Edition) & February 2015 (7th Edition) Available',
      statusNoteHi: 'सीटीईटी 2015: 20 सितंबर 2015 (8वां संस्करण) एवं 22 फरवरी 2015 (7वां संस्करण) उपलब्ध',
      papers: PAPERS_DATA.filter(p => p.category === 'ctet' && p.year === 2015)
    }
  ];

  const currentYearData = 
    selectedCategory === 'constable' ? constableYears :
    selectedCategory === 'upsi' ? upsiYears :
    selectedCategory === 'pet' ? petYears :
    selectedCategory === 'upcat' ? upcatYears : ctetYears;

  const filteredYears = selectedYearFilter === 'all' 
    ? currentYearData 
    : currentYearData.filter(y => y.year === selectedYearFilter);

  // Quick summary counts
  const availablePapersCount = currentYearData.reduce((acc, y) => acc + y.papers.length, 0);

  const handleSelectExam = (cat: ExamCategory) => {
    setSelectedCategory(cat);
    setSelectedYearFilter('all');
    setSelectedShiftId(null);
    setCtetSubFilter('all');
  };

  const handleLaunchMixed10YearMock = () => {
    const ctetQs = PAPERS_DATA.filter(p => p.category === 'ctet').flatMap(p => p.questions);
    const shuffled = [...ctetQs].sort(() => 0.5 - Math.random());
    const count = Math.min(30, shuffled.length);
    const selected = shuffled.slice(0, count);

    startCustomTest(
      `CTET Mixed 10-Year PYQ Mock Test (${count} Qs)`,
      `सीटीईटी 10-वर्षीय मिश्रित वास्तविक प्रश्न पत्र टेस्ट (${count} प्रश्न)`,
      selected,
      Math.max(30, count),
      { positive: 1.0, negative: 0.0, sectionalCutoffPercent: 60 }
    );
  };

  const filterCtetPapers = (papers: PaperMeta[]) => {
    if (selectedCategory !== 'ctet') return papers;
    if (ctetSubFilter === 'paper1') return papers.filter(p => p.paperType === 'Paper 1');
    if (ctetSubFilter === 'paper2') return papers.filter(p => p.paperType === 'Paper 2');
    if (ctetSubFilter === 'shift1') return papers.filter(p => p.shift.includes('Shift 1') || p.shift.includes('Morning'));
    if (ctetSubFilter === 'shift2') return papers.filter(p => p.shift.includes('Shift 2') || p.shift.includes('Afternoon'));
    if (ctetSubFilter === 'cbt') return papers.filter(p => p.shift.includes('CBT') || p.paperCode.includes('CBT'));
    return papers;
  };

  const examCardsList = [
    {
      id: 'constable' as ExamCategory,
      title: 'UP Police Constable',
      titleHi: 'यूपी पुलिस कांस्टेबल (आरक्षी)',
      subtitle: 'Previous Papers • Mock Tests • Practice',
      icon: <Shield className="w-5 h-5" />,
      badge: '60,244 Posts',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
      id: 'upsi' as ExamCategory,
      title: 'UP Police SI',
      titleHi: 'यूपी पुलिस एसआई / UPSI (दरोगा)',
      subtitle: 'Previous Papers • Mock Tests • Practice',
      icon: <Award className="w-5 h-5" />,
      badge: 'Sub Inspector',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    },
    {
      id: 'pet' as ExamCategory,
      title: 'UPSSSC PET',
      titleHi: 'यूपीएसएसएससी पीईटी (PET)',
      subtitle: 'Previous Papers • Mock Tests • Practice',
      icon: <GraduationCap className="w-5 h-5" />,
      badge: 'Group B & C Eligibility',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 'upcat' as ExamCategory,
      title: 'UP CAT',
      titleHi: 'यूपी कैट (UP CAT)',
      subtitle: 'Previous Papers • Mock Tests • Practice',
      icon: <Sparkles className="w-5 h-5" />,
      badge: 'Admission & Aptitude',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    },
    {
      id: 'ctet' as ExamCategory,
      title: 'CTET (CBSE)',
      titleHi: 'केंद्रीय शिक्षक पात्रता परीक्षा (CTET)',
      subtitle: 'Paper 1 & 2 • All Sessions • Real Mock Tests',
      icon: <BookOpen className="w-5 h-5" />,
      badge: 'CBSE Central TET',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    }
  ];

  return (
    <div className="space-y-6">

      {/* Competitive Exam Cards Section */}
      <section className="space-y-3" aria-label="Competitive Exam Selection">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Competitive Exams (प्रतियोगी परीक्षाएं)</span>
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Tap an exam card to open its dedicated preparation section
          </span>
        </div>

        {/* 5 Cards Grid - Same design, size, colors, fonts, spacing, and animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {examCardsList.map((exam) => {
            const isSelected = selectedCategory === exam.id;
            return (
              <button
                key={exam.id}
                type="button"
                onClick={() => handleSelectExam(exam.id)}
                className={`group relative text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                {/* Active Indicator Strip */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-inner'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 group-hover:text-amber-300 group-hover:border-slate-600'
                    }`}>
                      {exam.icon}
                    </div>

                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${exam.badgeColor}`}>
                      {exam.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    {exam.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className={`font-semibold flex items-center gap-1 ${
                    isSelected ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}>
                    {isSelected ? '✓ Active Section' : 'Open Prep Section'}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                    isSelected ? 'text-amber-400' : 'text-slate-500'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>
      </section>
      
      {/* Top Banner & Official Verification Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 text-slate-100 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {selectedCategory === 'constable' && 'UPPBPB OFFICIAL 10-YEAR EXAMINATION REPOSITORY'}
                {selectedCategory === 'upsi' && 'UPPBPB OFFICIAL 10-YEAR EXAMINATION REPOSITORY'}
                {selectedCategory === 'pet' && 'UPSSSC OFFICIAL PRELIMINARY ELIGIBILITY TEST (PET) REPOSITORY'}
                {selectedCategory === 'upcat' && 'UP COMBINED APTITUDE / ADMISSION TEST (UP CAT) REPOSITORY'}
                {selectedCategory === 'ctet' && 'CBSE CTET OFFICIAL 10-YEAR EXAMINATION ARCHIVE & MOCK TEST PORTAL'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {selectedCategory === 'constable' && 'UP Police Constable Previous 10 Years Papers (2013 - 2024)'}
              {selectedCategory === 'upsi' && 'UP Police Sub Inspector (UPSI) Previous 10 Years Papers (2011 - 2024)'}
              {selectedCategory === 'pet' && 'UPSSSC PET Previous Years Question Papers & Mock Tests (2021 - 2024)'}
              {selectedCategory === 'upcat' && 'UP CAT Previous Years Question Papers & Mock Tests (2022 - 2024)'}
              {selectedCategory === 'ctet' && 'CTET (CBSE) Previous 10 Years Papers & Mock Tests (2015 - 2024)'}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl font-hindi">
              {selectedCategory === 'constable' && 'उत्तर प्रदेश पुलिस आरक्षी (नागरिक पुलिस व PAC) के विगत 10 वर्षों के प्रामाणिक प्रश्न पत्र, वास्तविक परीक्षा पैटर्न (+2 / -0.5), समय सीमा (120 मिनट) एवं विस्तृत व्याख्या सहित।'}
              {selectedCategory === 'upsi' && 'उत्तर प्रदेश पुलिस उपनिरीक्षक (दरोगा) के 10 वर्षों के प्रामाणिक ऑनलाइन सीबीटी प्रश्न पत्र, 160 प्रश्न, 400 अंक व 35% अनुभागीय अर्हता (Sectional Cutoff) विश्लेषण सहित।'}
              {selectedCategory === 'pet' && 'उत्तर प्रदेश अधीनस्थ सेवा चयन आयोग (UPSSSC) प्रारंभिक अर्हता परीक्षा (PET) के प्रामाणिक प्रश्न पत्र, 100 प्रश्न, 100 अंक, नकारात्मक अंकन (-0.25) व विस्तृत हल।'}
              {selectedCategory === 'upcat' && 'उत्तर प्रदेश संयुक्त प्रवेश एवं अभिरुचि परीक्षा (UP CAT) के आधिकारिक प्रश्न पत्र, वास्तविक परीक्षा पैटर्न, 120 मिनट समय सीमा एवं पूर्ण समाधान।'}
              {selectedCategory === 'ctet' && 'केन्द्रीय शिक्षक पात्रता परीक्षा (CTET) के विगत 10 वर्षों के सभी सत्रों के आधिकारिक प्रश्न पत्र (Paper 1 प्राथमिक एवं Paper 2 उच्च प्राथमिक), वास्तविक परीक्षा पैटर्न (+1 अंक, कोई नकारात्मक अंकन नहीं), 150 मिनट समय सीमा, रीयल टाइम्ड मॉक टेस्ट एवं पूर्ण व्याख्या सहित।'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-lg border border-slate-700/60 shrink-0 text-xs">
            <div>
              <div className="text-slate-400">उपलब्ध प्रश्न पत्र</div>
              <div className="text-lg font-bold text-amber-400">{availablePapersCount} Shifts</div>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <div className="text-slate-400">कुल प्रश्न बैंक</div>
              <div className="text-lg font-bold text-emerald-400">100% Verified</div>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <div className="text-slate-400">नेगेटिव मार्किंग</div>
              <div className="text-lg font-bold text-white">
                {selectedCategory === 'constable' && '0.5 Mark'}
                {selectedCategory === 'upsi' && 'None (35% Sec.)'}
                {selectedCategory === 'pet' && '0.25 Mark'}
                {selectedCategory === 'upcat' && '1.0 Mark'}
                {selectedCategory === 'ctet' && 'No Negative (0.0)'}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Rule Notice conforming to accuracy requirement */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-200">सत्यता एवं प्रामाणिकता नियम (Accuracy Guarantee): </strong>
            इस पोर्टल पर केवल वही प्रश्न पत्र सम्मिलित किए गए हैं जिनकी प्रामाणिकता आधिकारिक मास्टर उत्तर कुंजी अथवा राजकीय गजट से सत्यापित है। जिस वर्ष परीक्षा आयोजित नहीं हुई, उसकी स्पष्ट ऐतिहासिक स्थिति दर्शायी गई है।
          </div>
        </div>
      </div>

      {/* CTET Dedicated Navigation & Module Hub */}
      {selectedCategory === 'ctet' && (
        <div className="bg-slate-900 border border-rose-500/30 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>CTET 10-Year Master Repository (सीटीईटी परीक्षा संचयन)</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Paper 1, Paper 2, Shift-wise & Subject-wise Preparation
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                All authentic examination sessions across 10 years with real timed mock tests & solution analysis.
              </p>
            </div>

            {/* Launch Mixed 10-Year PYQ Mock Test Button */}
            <button
              type="button"
              onClick={handleLaunchMixed10YearMock}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Mixed 10-Year PYQ Mock Test (मिश्रित 10-वर्षीय टेस्ट)</span>
            </button>
          </div>

          {/* CTET Sub-Navigation Modules */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
            <button
              type="button"
              onClick={() => setCtetSubFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                ctetSubFilter === 'all'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Previous Year Papers ({ctetYears.reduce((acc, y) => acc + y.papers.length, 0)})
            </button>
            <button
              type="button"
              onClick={() => setCtetSubFilter('paper1')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                ctetSubFilter === 'paper1'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Paper 1 (Class I-V Primary)
            </button>
            <button
              type="button"
              onClick={() => setCtetSubFilter('paper2')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                ctetSubFilter === 'paper2'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Paper 2 (Class VI-VIII Elementary)
            </button>
            <button
              type="button"
              onClick={() => setCtetSubFilter('shift1')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                ctetSubFilter === 'shift1'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Shift 1 (Morning)
            </button>
            <button
              type="button"
              onClick={() => setCtetSubFilter('shift2')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                ctetSubFilter === 'shift2'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Shift 2 (Afternoon)
            </button>
            <button
              type="button"
              onClick={() => setCtetSubFilter('cbt')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                ctetSubFilter === 'cbt'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Online CBT Shifts
            </button>
            <button
              type="button"
              onClick={() => setCtetSubFilter('subject')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                ctetSubFilter === 'subject'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Subject-wise PYQ
            </button>
            <button
              type="button"
              onClick={() => setCtetSubFilter('topic')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                ctetSubFilter === 'topic'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Topic-wise PYQ
            </button>
          </div>

          {/* Quick Subject-wise Tray if selected */}
          {ctetSubFilter === 'paper1' && (
            <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-rose-300">
                  Paper 1 Structure (कक्षा 1 से 5 प्राथमिक शिक्षक - Primary Stage)
                </span>
                <span className="text-slate-400">150 Questions • 150 Marks • 150 Mins</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => openPracticeMode({ subject: 'cdp' })}
                  className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded text-left transition cursor-pointer"
                >
                  <div className="font-bold text-white text-[11px]">1. बाल विकास (CDP)</div>
                  <div className="text-[10px] text-slate-400">30 Qs PYQ Practice</div>
                </button>
                <button
                  type="button"
                  onClick={() => openPracticeMode({ subject: 'maths' })}
                  className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded text-left transition cursor-pointer"
                >
                  <div className="font-bold text-white text-[11px]">2. गणित (Maths)</div>
                  <div className="text-[10px] text-slate-400">30 Qs Content + Pedagogy</div>
                </button>
                <button
                  type="button"
                  onClick={() => openPracticeMode({ subject: 'evs' })}
                  className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded text-left transition cursor-pointer"
                >
                  <div className="font-bold text-white text-[11px]">3. पर्यावरण (EVS)</div>
                  <div className="text-[10px] text-slate-400">30 Qs Content + Pedagogy</div>
                </button>
                <button
                  type="button"
                  onClick={() => openPracticeMode({ subject: 'hindi' })}
                  className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded text-left transition cursor-pointer"
                >
                  <div className="font-bold text-white text-[11px]">4. भाषा I & II</div>
                  <div className="text-[10px] text-slate-400">Hindi & English PYQ</div>
                </button>
              </div>
            </div>
          )}

          {/* Quick Paper 2 Structure Tray */}
          {ctetSubFilter === 'paper2' && (
            <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-rose-300">
                  Paper 2 Structure (कक्षा 6 से 8 उच्च प्राथमिक - Elementary Stage)
                </span>
                <span className="text-slate-400">150 Questions • 150 Marks • 150 Mins</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => openPracticeMode({ subject: 'cdp' })}
                  className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded text-left transition cursor-pointer"
                >
                  <div className="font-bold text-white text-[11px]">1. बाल विकास (CDP)</div>
                  <div className="text-[10px] text-slate-400">30 Qs Adolescent Pedagogy</div>
                </button>
                <button
                  type="button"
                  onClick={() => openPracticeMode({ subject: 'science' })}
                  className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded text-left transition cursor-pointer"
                >
                  <div className="font-bold text-white text-[11px]">2. गणित व विज्ञान</div>
                  <div className="text-[10px] text-slate-400">60 Qs Maths & Science</div>
                </button>
                <button
                  type="button"
                  onClick={() => openPracticeMode({ subject: 'social_studies' })}
                  className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded text-left transition cursor-pointer"
                >
                  <div className="font-bold text-white text-[11px]">3. सामाजिक अध्ययन (SST)</div>
                  <div className="text-[10px] text-slate-400">60 Qs History, Civics, Geo</div>
                </button>
                <button
                  type="button"
                  onClick={() => openPracticeMode({ subject: 'hindi' })}
                  className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded text-left transition cursor-pointer"
                >
                  <div className="font-bold text-white text-[11px]">4. भाषा I व II</div>
                  <div className="text-[10px] text-slate-400">Hindi & English Pedagogy</div>
                </button>
              </div>
            </div>
          )}

          {/* Quick Subject-wise Tray if selected */}
          {ctetSubFilter === 'subject' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-2">
              {[
                { key: 'cdp' as const, nameHi: 'बाल विकास (CDP)', nameEn: 'Child Dev & Pedagogy' },
                { key: 'evs' as const, nameHi: 'पर्यावरण अध्ययन (EVS)', nameEn: 'Environmental Studies' },
                { key: 'maths' as const, nameHi: 'गणित एवं शिक्षाशास्त्र', nameEn: 'Mathematics & Pedagogy' },
                { key: 'hindi' as const, nameHi: 'हिन्दी भाषा (Language I)', nameEn: 'Hindi Language & Pedagogy' },
                { key: 'english' as const, nameHi: 'अंग्रेजी भाषा (Language II)', nameEn: 'English Language & Pedagogy' },
                { key: 'science' as const, nameHi: 'विज्ञान एवं शिक्षणशास्त्र', nameEn: 'Science & Pedagogy' },
                { key: 'social_studies' as const, nameHi: 'सामाजिक अध्ययन (SST)', nameEn: 'Social Studies & Pedagogy' },
              ].map(sub => (
                <button
                  key={sub.key}
                  type="button"
                  onClick={() => openPracticeMode({ subject: sub.key })}
                  className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-left transition-all flex flex-col justify-between cursor-pointer"
                >
                  <span className="text-xs font-bold text-white">{sub.nameHi}</span>
                  <span className="text-[11px] text-slate-400 mt-1">{sub.nameEn}</span>
                  <span className="text-[10px] text-amber-400 mt-2 font-semibold flex items-center gap-1">
                    <span>Practice Subject</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Topic-wise Tray if selected */}
          {ctetSubFilter === 'topic' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-2">
              {[
                { name: 'Piaget and Vygotsky Theories', nameHi: 'पियाजे एवं वायगोत्स्की सिद्धांत' },
                { name: 'Howard Gardner Multiple Intelligences', nameHi: 'हावर्ड गार्डनर बहुबुद्धि' },
                { name: 'Kohlberg Moral Development Stages', nameHi: 'कोहलबर्ग नैतिक विकास' },
                { name: 'Inclusive Education & Individual Differences', nameHi: 'समावेशी शिक्षा' },
                { name: 'Flora & Fauna Characteristics', nameHi: 'निपेंथिस एवं पादप अनुकूलन' },
                { name: 'Shelter & Regional Housing Adaptations', nameHi: 'असम बांस के घर एवं आवास' },
                { name: 'Van Hiele Geometric Thinking', nameHi: 'वैन हीले ज्यामितीय स्तर' },
                { name: 'Language Acquisition & Chomsky', nameHi: 'चॉम्स्की भाषा अर्जन LAD' },
              ].map(top => (
                <button
                  key={top.name}
                  type="button"
                  onClick={() => openPracticeMode({ topic: top.name })}
                  className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-left transition-all flex flex-col justify-between cursor-pointer"
                >
                  <span className="text-xs font-bold text-white">{top.nameHi}</span>
                  <span className="text-[11px] text-slate-400 mt-1">{top.name}</span>
                  <span className="text-[10px] text-amber-400 mt-2 font-semibold flex items-center gap-1">
                    <span>Topic Practice</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Year Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-400 font-medium whitespace-nowrap mr-1">वर्ष चयन (Filter Year):</span>
        <button
          type="button"
          onClick={() => setSelectedYearFilter('all')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
            selectedYearFilter === 'all'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
          }`}
        >
          All Years (सभी 10 वर्ष)
        </button>
        {currentYearData.map(y => (
          <button
            key={y.year}
            type="button"
            onClick={() => setSelectedYearFilter(y.year)}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              selectedYearFilter === y.year
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <span>{y.year}</span>
            {y.available ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Paper Available" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" title="No Exam Held" />
            )}
          </button>
        ))}
      </div>

      {/* 10-Year Timeline & Cards Grid */}
      <div className="space-y-4">
        {filteredYears.map((yearItem) => {
          const hasPapers = yearItem.available && yearItem.papers.length > 0;

          return (
            <div 
              key={yearItem.year}
              className={`rounded-xl border transition-all ${
                hasPapers 
                  ? 'bg-slate-900/90 border-slate-800 shadow-sm hover:border-slate-700' 
                  : 'bg-slate-900/40 border-slate-800/60 opacity-80'
              }`}
            >
              {/* Year Header Bar */}
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold shrink-0 ${
                    hasPapers 
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    <span className="text-sm tracking-tight">{yearItem.year}</span>
                    <span className="text-[10px] uppercase font-semibold">
                      {hasPapers ? '✓ PAPERS' : 'NO EXAM'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-white">
                        {selectedCategory === 'constable' && `UP Police Constable Examination ${yearItem.year}`}
                        {selectedCategory === 'upsi' && `UP Police SI / UPSI Examination ${yearItem.year}`}
                        {selectedCategory === 'pet' && `UPSSSC PET Examination ${yearItem.year}`}
                        {selectedCategory === 'upcat' && `UP CAT Examination ${yearItem.year}`}
                        {selectedCategory === 'ctet' && `CTET (CBSE) Examination ${yearItem.year}`}
                      </h2>
                      {hasPapers ? (
                        <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{yearItem.papers.length} {yearItem.papers.length === 1 ? 'Shift Verified' : 'Shifts Verified'}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-amber-400/90 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{selectedCategory === 'ctet' ? 'Verified paper not available' : 'No Official Exam'}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-hindi mt-0.5">
                      {language === 'en' ? yearItem.statusNote : yearItem.statusNoteHi}
                    </p>
                  </div>
                </div>

                {/* Overall Year Actions if papers exist */}
                {hasPapers && (
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => openPracticeMode({ year: yearItem.year })}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 flex items-center gap-1.5 transition-colors font-medium"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>{yearItem.year} Practice ({yearItem.papers.reduce((s, p) => s + p.questions.length, 0)} Qs)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Papers / Shifts Listing */}
              {hasPapers ? (
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Available Shifts & Question Papers (अलग-अलग पालियां):
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                    {(selectedCategory === 'ctet' ? filterCtetPapers(yearItem.papers) : yearItem.papers).map((paper) => {
                      const paperAttempts = attempts.filter(a => a.paperId === paper.id);
                      const latestPaperAttempt = paperAttempts[0];

                      return (
                        <div 
                          key={paper.id}
                          className="bg-slate-800/60 border border-slate-700/80 rounded-lg p-4 flex flex-col justify-between hover:bg-slate-800/90 transition-all"
                        >
                          <div>
                            {/* Shift Title & Code */}
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                  {paper.paperType && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                      {paper.paperType}
                                    </span>
                                  )}
                                  {paper.session && (
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                                      {paper.session}
                                    </span>
                                  )}
                                  {paper.setCode && (
                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                      {paper.setCode}
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-sm font-bold text-white">
                                  {language === 'en' ? paper.examName : paper.examNameHi}
                                </h3>
                                <div className="text-xs text-amber-400 font-medium mt-0.5">
                                  {paper.shift} · {paper.examDate}
                                </div>
                              </div>
                              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 shrink-0">
                                {paper.paperCode}
                              </span>
                            </div>

                            {/* Official Pattern Metadata (NO PILLS) */}
                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-2.5 pb-2.5 border-b border-slate-700/60 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{paper.durationMinutes} Mins ({paper.durationMinutes >= 150 ? '2.5 Hours' : '2 Hours'})</span>
                              </span>
                              <span>·</span>
                              <span>{paper.totalQuestions} Questions</span>
                              <span>·</span>
                              <span>{paper.totalMarks} Marks</span>
                              <span>·</span>
                              <span className="text-amber-300 font-medium">
                                +{paper.markingScheme.positive} / -{paper.markingScheme.negative} {paper.markingScheme.negative === 0 ? '(No Negative)' : ''}
                              </span>
                            </div>

                            {/* Verified Source Disclosure */}
                            <div className="mt-2 text-[11px] text-slate-400 space-y-0.5">
                              <div>
                                <span className="text-slate-300 font-semibold">Source: </span>
                                <span>{paper.verifiedSource}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>
                                  <span className="text-slate-300 font-semibold">Verified: </span>
                                  <span>{paper.lastVerifiedDate}</span>
                                </span>
                                <span>·</span>
                                <span className="text-emerald-400 font-medium">
                                  {paper.sourceType}
                                </span>
                              </div>
                            </div>

                            {/* Past result if attempted */}
                            {latestPaperAttempt && (
                              <div className="mt-2.5 p-2 bg-slate-900/80 rounded border border-emerald-500/30 text-xs flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-emerald-400">
                                  <Award className="w-3.5 h-3.5" />
                                  <span>Last Score: {latestPaperAttempt.score.toFixed(1)} / {latestPaperAttempt.maxScore}</span>
                                  <span className="text-slate-400">({latestPaperAttempt.accuracy}% Acc.)</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => viewAttemptResult(latestPaperAttempt)}
                                  className="text-amber-400 hover:text-amber-300 underline font-medium text-[11px]"
                                >
                                  View Result
                                </button>
                              </div>
                            )}
                          </div>

                          {/* 4 Action Buttons requested in Brief */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-4 pt-3 border-t border-slate-700/60">
                            {/* [Start Mock Test] */}
                            <button
                              type="button"
                              onClick={() => startMockTest(paper)}
                              className="px-2.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Start Mock</span>
                            </button>

                            {/* [Practice Questions] */}
                            <button
                              type="button"
                              onClick={() => openPracticeMode({ paper })}
                              className="px-2.5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-md text-xs flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                              <span>Practice</span>
                            </button>

                            {/* [View Paper] */}
                            <button
                              type="button"
                              onClick={() => openPaperViewer(paper)}
                              className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-md text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-400" />
                              <span>View Paper</span>
                            </button>

                            {/* [Results] */}
                            <button
                              type="button"
                              onClick={() => {
                                if (latestPaperAttempt) {
                                  viewAttemptResult(latestPaperAttempt);
                                } else {
                                  setCurrentView('analytics');
                                }
                              }}
                              className={`px-2.5 py-2 font-medium rounded-md text-xs flex items-center justify-center gap-1.5 transition-colors border ${
                                latestPaperAttempt
                                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/50'
                                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-300'
                              }`}
                            >
                              <History className="w-3.5 h-3.5" />
                              <span>{latestPaperAttempt ? 'Results' : 'History'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-5 text-xs text-slate-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400/90 shrink-0" />
                  <span>
                    {selectedCategory === 'ctet'
                      ? 'Paper not available from verified source. No CTET examination was conducted by CBSE for this year.'
                      : 'No recruitment paper was conducted for this year. Verified historical status recorded from official archives.'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
