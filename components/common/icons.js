import {
  ArrowRight, Award, BarChart2, BarChart3, Brain, Calculator, Calendar,
  CalendarClock, Check, ChevronLeft, ChevronRight, Clock, Crown, DollarSign,
  ExternalLink, Eye, Globe, GraduationCap, Instagram, Layers, LineChart, Loader2,
  Lock, Mail, MapPin, Menu, MessageCircle, Newspaper, Phone, Play, Ruler, Send,
  Shield, ShieldCheck, Sparkles, Star, Target, TrendingUp, Users, Video, X, Youtube,
  Zap,
} from "lucide-react";

// The admin picks an icon from this list by key. Component names are never
// stored in or read from the database, so bad data can't break a render.
export const ICONS = {
  "arrow-right": ArrowRight,
  award: Award,
  "bar-chart-2": BarChart2,
  "bar-chart-3": BarChart3,
  brain: Brain,
  calculator: Calculator,
  calendar: Calendar,
  "calendar-clock": CalendarClock,
  check: Check,
  clock: Clock,
  crown: Crown,
  "dollar-sign": DollarSign,
  "external-link": ExternalLink,
  eye: Eye,
  globe: Globe,
  "graduation-cap": GraduationCap,
  instagram: Instagram,
  layers: Layers,
  "line-chart": LineChart,
  lock: Lock,
  mail: Mail,
  "map-pin": MapPin,
  "message-circle": MessageCircle,
  newspaper: Newspaper,
  phone: Phone,
  play: Play,
  ruler: Ruler,
  send: Send,
  shield: Shield,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  "trending-up": TrendingUp,
  users: Users,
  video: Video,
  youtube: Youtube,
  zap: Zap,
};

/** Friendly labels for the admin icon picker. */
export const ICON_OPTIONS = Object.keys(ICONS).map((key) => ({
  value: key,
  label: key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}));

/** Always returns a component, so a stale icon key can never crash a page. */
export function getIcon(key) {
  return ICONS[key] || Sparkles;
}

// Fixed icons used directly by layout chrome (not admin-selectable).
export {
  ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Loader2, Menu, Play, X,
  Youtube, Send, MessageCircle, Users, Star, Mail, Phone, MapPin, Instagram,
  Check, Clock, CalendarClock, Lock, Calculator, Target, Layers, Ruler,
  Globe, Video, Eye, Calendar, Sparkles, DollarSign,
};
