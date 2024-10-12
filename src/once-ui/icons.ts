import { IconType } from 'react-icons';

import {
    HiChevronUp,
    HiChevronDown,
    HiChevronRight,
    HiChevronLeft,
    HiArrowUpRight,
    HiOutlineArrowPath,
    HiCheck,
    HiMiniQuestionMarkCircle,
    HiMiniXMark,
    HiOutlineLink,
    HiExclamationTriangle,
    HiInformationCircle,
    HiExclamationCircle,
    HiCheckCircle,
    HiMiniGlobeEuropeAfrica,
    HiEnvelope,
    HiCalendarDays
} from "react-icons/hi2";

import {
    PiHouseDuotone,
    PiUserCircleDuotone,
    PiGridFourDuotone,
    PiBookBookmarkDuotone,
    PiImageDuotone,
    PiYoutubeLogoDuotone
} from "react-icons/pi";

import {
    FaDiscord,
    FaGithub,
    FaLinkedin,
    FaXTwitter
} from "react-icons/fa6";

// Nouveau bloc pour les icônes supplémentaires
import {
    SiVisualstudio,
    SiJavascript,
    SiPython,
    SiReact,
    SiUnrealengine,
    SiUnity,
    SiGodotengine,
    SiCsharp,
    SiHtml5,
    SiCss3,
    SiDocker,
    SiKubernetes,
    SiElectron,
    SiVuedotjs,
    SiSass,
    SiAdobe,
    SiBlender,
    SiFigma,
} from "react-icons/si"; // Icons for software dev, arts, writing, and experimental projects

import {
    GiMusicalNotes,
    GiDrumKit,
    GiPianoKeys,
    GiMicrophone,
    GiPaintBrush,
    GiFilmProjector,
    GiArtificialHive,
    GiTestTubes,
    GiFeather
} from "react-icons/gi"; // Icons for game dev, music, visual arts, writing, and experimental projects

import {
    MdOutlineMusicNote,
    MdMusicNote,
    MdQueueMusic,
    MdBrush,
    MdPalette,
    MdLightbulbOutline,
    MdOutlineEdit,
    MdOutlineDescription,
    MdBook,
    MdHome,
    MdOutlineHome,
} from "react-icons/md"; // Icons for coding, music, arts, writing, narrative design, home

import {
    TbMusic,
    TbMusicOff,
    TbNotes,
    TbMusicCode,
    TbBook,
    TbScript,
    TbHome,
    TbHome2
} from "react-icons/tb"; // More music, writing, and home variants

import {
    FaHome,
    FaHouseUser,
    FaYoutube
} from "react-icons/fa"; // More home variants

export const iconLibrary: Record<string, IconType> = {
    // Icônes précédentes
    chevronUp: HiChevronUp,
    chevronDown: HiChevronDown,
    chevronRight: HiChevronRight,
    chevronLeft: HiChevronLeft,
    refresh: HiOutlineArrowPath,
    arrowUpRight: HiArrowUpRight,
    check: HiCheck,
    helpCircle: HiMiniQuestionMarkCircle,
    infoCircle: HiInformationCircle,
    warningTriangle: HiExclamationTriangle,
    errorCircle: HiExclamationCircle,
    checkCircle: HiCheckCircle,
    email: HiEnvelope,
    globe: HiMiniGlobeEuropeAfrica,
    person: PiUserCircleDuotone,
    grid: PiGridFourDuotone,
    book: PiBookBookmarkDuotone,
    close: HiMiniXMark,
    openLink: HiOutlineLink,
    calendar: HiCalendarDays,
    home: PiHouseDuotone,
    gallery: PiImageDuotone,
    discord: FaDiscord,
    github: FaGithub,
    linkedin: FaLinkedin,
    x: FaXTwitter,

    // Nouveaux icônes pour dev de jeu, logiciel, code
    vsCode: SiVisualstudio,
    js: SiJavascript,
    python: SiPython,
    react: SiReact,
    unreal: SiUnrealengine,
    unity: SiUnity,
    godot: SiGodotengine,
    csharp: SiCsharp,
    html: SiHtml5,
    css: SiCss3,
    docker: SiDocker,
    kubernetes: SiKubernetes,
    electron: SiElectron,
    vue: SiVuedotjs,
    sass: SiSass,

    // Nouveaux icônes pour la musique
    musicNote: MdOutlineMusicNote,
    music: MdMusicNote,
    queueMusic: MdQueueMusic,
    musicalNotes: GiMusicalNotes,
    drumKit: GiDrumKit,
    piano: GiPianoKeys,
    microphone: GiMicrophone,
    musicAlt: TbMusic,
    musicOff: TbMusicOff,
    musicCode: TbMusicCode,
    notes: TbNotes,
    youtube: FaYoutube,

    // Nouveaux icônes pour les arts visuels
    paintBrush: GiPaintBrush,
    projector: GiFilmProjector,
    palette: MdPalette,
    brush: MdBrush,
    adobe: SiAdobe,
    blender: SiBlender,
    figma: SiFigma,

    // Nouveaux icônes pour les projets expérimentaux
    lightbulb: MdLightbulbOutline,
    testTubes: GiTestTubes,
    artificialHive: GiArtificialHive,

    // Nouveaux icônes pour l'écriture, narrative design, et scénarisation
    feather: GiFeather,
    bookv: MdBook,
    description: MdOutlineDescription,
    edit: MdOutlineEdit,
    script: TbScript,
    narrativeDesign: TbBook,

	// Nouveaux icônes pour Home
	homeMd: MdHome,
	outlineHomeMd: MdOutlineHome,
	homeFa: FaHome,
	houseUserFa: FaHouseUser,
	homeTb: TbHome,
	homeTb2: TbHome2,
};

