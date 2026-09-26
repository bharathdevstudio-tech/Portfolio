import {
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaNodeJs,
  FaPython,
  FaGitAlt,
  FaGithub,
  FaDatabase,
  FaServer,
  FaTasks,
  FaCloudSun,
  FaShoppingCart,
  FaStickyNote,
  FaAward,
  FaRoute,
  FaBrain,
  FaPalette,
} from 'react-icons/fa'
import { FaDroplet, FaHeartPulse } from 'react-icons/fa6'
import {
  SiJavascript,
  SiTypescript,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiTailwindcss,
  SiFigma,
  SiFlutter,
} from 'react-icons/si'
import { TbCode, TbTool, TbPlugConnected } from 'react-icons/tb'
import { VscVscode } from 'react-icons/vsc'

// Static lookup keeps icons tree-shaken and bundled at build time.
// Add new icons here as needed (see data/*.js for the keys used).
const ICONS = {
  // Font Awesome
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaNodeJs,
  FaPython,
  FaGitAlt,
  FaGithub,
  FaDatabase,
  FaServer,
  FaTasks,
  FaCloudSun,
  FaShoppingCart,
  FaStickyNote,
  FaAward,
  FaDroplet,
  FaHeartPulse,
  FaRoute,
  FaBrain,
  FaPalette,
  // Simple Icons
  SiJavascript,
  SiTypescript,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiTailwindcss,
  SiFigma,
  SiFlutter,
  // Tabler
  TbCode,
  TbTool,
  TbPlugConnected,
  // VS Code
  VscVscode,
}

export default function TechIcon({ name, size = '1em', label, className }) {
  const Icon = ICONS[name]
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
      aria-hidden="true"
    >
      {Icon ? <Icon size={size} /> : <GradientBadge label={label || name || '?'} />}
    </span>
  )
}

function GradientBadge({ label }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '1.4em',
        fontSize: '0.6em',
        fontWeight: 800,
        padding: '0.2em 0.45em',
        borderRadius: '0.5em',
        background: 'linear-gradient(120deg,#7c3aed,#06b6d4)',
        color: '#fff',
      }}
    >
      {String(label).slice(0, 2).toUpperCase()}
    </span>
  )
}