"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Info,
  MoreVertical,
  Eye,
  BarChart2,
  RefreshCw,
  Building2,
  ChevronLeft,
  ChevronDown,
  Trash2,
  Check,
  Smartphone,
  Monitor,
  ArrowLeft,
} from "lucide-react";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { Button } from "@/components/ui/Button";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SurveyVersion {
  id: string;
  name: string;
  status: "Active" | "Retired";
  schoolsUsing?: number;
  liveCount?: number;
}

interface SurveyInstrument {
  id: string;
  name: string;
  gradeBand: string;
  gradeBandColor: string;
  activeSince: string;
  questionTypes: string;
  questions: number;
  versions: SurveyVersion[];
  activeVersionCount: number;
  retiredVersionCount: number;
  schoolsUsing: number;
  liveCount: number;
  formats: string[];
  cardAccentColor: string;
  topGradient: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INSTRUMENTS: SurveyInstrument[] = [
  {
    id: "i1",
    name: "Elementary School Student Meal Survey",
    gradeBand: "K-5",
    gradeBandColor: "#E0F2FE",
    activeSince: "12 Aug 2025",
    questionTypes: "3-point + open-ended",
    questions: 22,
    versions: [
      { id: "v1", name: "v3 (Active)", status: "Active", schoolsUsing: 28, liveCount: 4 },
      { id: "v2", name: "v2 (Active)", status: "Active", schoolsUsing: 18, liveCount: 2 },
      { id: "v3", name: "v1 (Retired)", status: "Retired" },
    ],
    activeVersionCount: 3,
    retiredVersionCount: 0,
    schoolsUsing: 46,
    liveCount: 6,
    formats: ["3-point", "Open-ended", "Multi-select", "Single-select"],
    cardAccentColor: "#7C3AED",
    topGradient: "linear-gradient(90deg, #7C3AED 0%, #A78BFA 100%)",
  },
  {
    id: "i2",
    name: "Middle School Student Meal Survey",
    gradeBand: "6-8",
    gradeBandColor: "#FEF3C7",
    activeSince: "12 Aug 2025",
    questionTypes: "3-point + open-ended",
    questions: 24,
    versions: [
      { id: "v4", name: "v3 (Active)", status: "Active", schoolsUsing: 26, liveCount: 5 },
      { id: "v5", name: "v2 (Active)", status: "Active", schoolsUsing: 20, liveCount: 4 },
      { id: "v6", name: "v1 (Retired)", status: "Retired" },
    ],
    activeVersionCount: 3,
    retiredVersionCount: 1,
    schoolsUsing: 46,
    liveCount: 9,
    formats: ["3-point", "Open-ended", "Multi-select", "Single-select"],
    cardAccentColor: "#D97706",
    topGradient: "linear-gradient(90deg, #D97706 0%, #FBBF24 100%)",
  },
  {
    id: "i3",
    name: "High School Student Meal Survey",
    gradeBand: "9-12",
    gradeBandColor: "#D1FAE5",
    activeSince: "5 Aug 2025",
    questionTypes: "3-point + open-ended",
    questions: 27,
    versions: [
      { id: "v7", name: "v3 (Active)", status: "Active", schoolsUsing: 19, liveCount: 2 },
      { id: "v8", name: "v2 (Active)", status: "Active", schoolsUsing: 12, liveCount: 2 },
      { id: "v9", name: "v1 (Retired)", status: "Retired" },
      { id: "v10", name: "v0 (Retired)", status: "Retired" },
    ],
    activeVersionCount: 3,
    retiredVersionCount: 2,
    schoolsUsing: 31,
    liveCount: 4,
    formats: ["3-point", "Open-ended", "Multi-select", "Single-select"],
    cardAccentColor: "#586D4D",
    topGradient: "linear-gradient(90deg, #586D4D 0%, #86A871 100%)",
  },
];

// ─── Format Pill ─────────────────────────────────────────────────────────────

const FORMAT_COLORS: Record<string, { bg: string; text: string }> = {
  "3-point":       { bg: "#F0EAFB", text: "#4D1C9A" },
  "Open-ended":    { bg: "#F1EFEA", text: "#6D6D6D" },
  "Multi-select":  { bg: "#E3F0F5", text: "#1A5C7A" },
  "Single-select": { bg: "#FFF1DD", text: "#8A4B04" },
};

function FormatPill({ label }: { label: string }) {
  let displayLabel = label;
  if (label === "3-point") displayLabel = "3 points";
  else if (label === "Open-ended") displayLabel = "Open ended";
  else if (label === "Multi-select") displayLabel = "Multi select";
  else if (label === "Single-select") displayLabel = "Single select";

  const colors = FORMAT_COLORS[label] ?? { bg: "#F3F4F6", text: "#6B7280" };

  return (
    <span
      className="inline-flex items-center justify-center w-[83px] h-[20.5px] pt-[2px] pb-[2px] px-[10px] rounded-[9999px] text-[10px] font-bold whitespace-nowrap opacity-100 select-none font-sans"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {displayLabel}
    </span>
  );
}

// ─── Grade Band Badge ─────────────────────────────────────────────────────────

function GradeBadge({ band }: { band: string }) {
  if (band === "K-5") {
    return (
      <svg width="37" height="21" viewBox="0 0 37 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 10.25C0 4.58908 4.58908 0 10.25 0H26.4375C32.0984 0 36.6875 4.58908 36.6875 10.25C36.6875 15.9109 32.0984 20.5 26.4375 20.5H10.25C4.58908 20.5 0 15.9109 0 10.25Z" fill="#F0EAFB"/>
        <path d="M12.2236 5.92969V13.75H10.7466V5.92969H12.2236ZM16.918 5.92969L13.7812 9.74316L11.9873 11.6606L11.7241 10.2266L12.9702 8.60986L15.1079 5.92969H16.918ZM15.2744 13.75L12.8413 10.0869L13.8994 9.13086L17.0308 13.75H15.2744ZM19.813 9.83984V10.9624H16.875V9.83984H19.813ZM22.3589 10.1514L21.2256 9.87744L21.6606 5.92969H25.9629V7.10596H22.8369L22.6328 8.93213C22.7438 8.8641 22.9049 8.79606 23.1162 8.72803C23.3311 8.65641 23.5728 8.62061 23.8413 8.62061C24.2137 8.62061 24.5467 8.68148 24.8403 8.80322C25.134 8.92139 25.3828 9.09326 25.5869 9.31885C25.7946 9.54443 25.9504 9.82015 26.0542 10.146C26.1616 10.4683 26.2153 10.8335 26.2153 11.2417C26.2153 11.5998 26.1616 11.9364 26.0542 12.2515C25.9504 12.563 25.791 12.8405 25.5762 13.084C25.3613 13.3239 25.091 13.5137 24.7651 13.6533C24.4393 13.7894 24.0562 13.8574 23.6157 13.8574C23.2827 13.8574 22.9622 13.8091 22.6543 13.7124C22.3499 13.6121 22.076 13.4671 21.8325 13.2773C21.589 13.084 21.3939 12.8477 21.2471 12.5684C21.1038 12.2891 21.0251 11.9686 21.0107 11.6069H22.4126C22.4377 11.8468 22.5021 12.0509 22.606 12.2192C22.7098 12.3875 22.8459 12.5164 23.0142 12.606C23.186 12.6955 23.3848 12.7402 23.6104 12.7402C23.8145 12.7402 23.9899 12.7026 24.1367 12.6274C24.2871 12.5487 24.4106 12.4395 24.5073 12.2998C24.604 12.1602 24.6756 11.9954 24.7222 11.8057C24.7687 11.6159 24.792 11.4082 24.792 11.1826C24.792 10.9642 24.7651 10.7655 24.7114 10.5864C24.6577 10.4038 24.5754 10.2463 24.4644 10.1138C24.3534 9.98128 24.2137 9.87923 24.0454 9.80762C23.8807 9.736 23.6873 9.7002 23.4653 9.7002C23.1681 9.7002 22.939 9.74495 22.7778 9.83447C22.6203 9.92399 22.4806 10.0296 22.3589 10.1514Z" fill="#4D1C9A"/>
      </svg>
    );
  }

  if (band === "6-8") {
    return (
      <svg width="37" height="21" viewBox="0 0 37 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 10.25C0 4.58908 4.58908 0 10.25 0H26.6406C32.3015 0 36.8906 4.58908 36.8906 10.25C36.8906 15.9109 32.3015 20.5 26.6406 20.5H10.25C4.58908 20.5 0 15.9109 0 10.25Z" fill="#FFF1DD"/>
        <path d="M14.5117 5.86523H14.7051V7.00928H14.6138C14.1805 7.00928 13.7992 7.07552 13.4697 7.20801C13.1439 7.34049 12.8717 7.52669 12.6533 7.7666C12.4385 8.00293 12.2756 8.28402 12.1646 8.60986C12.0535 8.93213 11.998 9.28483 11.998 9.66797V10.9355C11.998 11.2327 12.0285 11.4941 12.0894 11.7197C12.1538 11.9417 12.2415 12.1297 12.3525 12.2837C12.4671 12.4341 12.5996 12.5469 12.75 12.6221C12.904 12.6973 13.0723 12.7349 13.2549 12.7349C13.4375 12.7349 13.6022 12.6973 13.749 12.6221C13.8958 12.5469 14.0212 12.4412 14.125 12.3052C14.2324 12.1655 14.313 12.0026 14.3667 11.8164C14.424 11.6302 14.4526 11.4261 14.4526 11.2041C14.4526 10.9857 14.4258 10.7834 14.3721 10.5972C14.3184 10.411 14.2396 10.248 14.1357 10.1084C14.0319 9.96517 13.903 9.85596 13.749 9.78076C13.5986 9.70199 13.4268 9.6626 13.2334 9.6626C12.9827 9.6626 12.759 9.72168 12.562 9.83984C12.3651 9.95443 12.2093 10.1048 12.0947 10.291C11.9801 10.4772 11.9175 10.6742 11.9067 10.8818L11.4287 10.6455C11.4466 10.3411 11.5111 10.0618 11.6221 9.80762C11.7367 9.55339 11.8888 9.33138 12.0786 9.1416C12.272 8.95182 12.4993 8.80501 12.7607 8.70117C13.0257 8.59733 13.3193 8.54541 13.6416 8.54541C14.014 8.54541 14.3398 8.61702 14.6191 8.76025C14.8984 8.8999 15.1294 9.09147 15.312 9.33496C15.4982 9.57845 15.6379 9.85954 15.731 10.1782C15.8241 10.4933 15.8706 10.8263 15.8706 11.1772C15.8706 11.5532 15.8097 11.9041 15.688 12.23C15.5698 12.5558 15.3979 12.8405 15.1724 13.084C14.9468 13.3275 14.6746 13.5173 14.356 13.6533C14.0373 13.7894 13.6792 13.8574 13.2817 13.8574C12.8628 13.8574 12.4868 13.7786 12.1538 13.6211C11.8244 13.4635 11.5415 13.2451 11.3052 12.9658C11.0688 12.6865 10.888 12.3607 10.7627 11.9883C10.6374 11.6159 10.5747 11.2131 10.5747 10.7798V10.2104C10.5747 9.59814 10.6589 9.02881 10.8271 8.50244C10.9954 7.97607 11.2443 7.51595 11.5737 7.12207C11.9067 6.72461 12.3185 6.41667 12.8091 6.19824C13.2996 5.97624 13.8672 5.86523 14.5117 5.86523ZM19.7485 9.83984V10.9624H16.8105V9.83984H19.7485ZM26.0757 11.6123C26.0757 12.0993 25.9611 12.5111 25.7319 12.8477C25.5063 13.1807 25.1966 13.4331 24.8027 13.605C24.4124 13.7733 23.9684 13.8574 23.4707 13.8574C22.9766 13.8574 22.5308 13.7733 22.1333 13.605C21.7394 13.4331 21.4261 13.1807 21.1934 12.8477C20.9642 12.5111 20.8496 12.0993 20.8496 11.6123C20.8496 11.2865 20.9141 10.991 21.043 10.7261C21.1755 10.4611 21.3581 10.2337 21.5908 10.0439C21.8236 9.85059 22.0993 9.70378 22.418 9.60352C22.7367 9.49967 23.084 9.44775 23.46 9.44775C23.9613 9.44775 24.4089 9.53906 24.8027 9.72168C25.2002 9.90072 25.5117 10.1532 25.7373 10.479C25.9629 10.8013 26.0757 11.179 26.0757 11.6123ZM24.647 11.5264C24.647 11.2757 24.5968 11.0591 24.4966 10.8765C24.3999 10.6903 24.262 10.547 24.083 10.4468C23.904 10.3465 23.6963 10.2964 23.46 10.2964C23.2201 10.2964 23.0106 10.3465 22.8315 10.4468C22.6561 10.547 22.5182 10.6903 22.418 10.8765C22.3213 11.0591 22.2729 11.2757 22.2729 11.5264C22.2729 11.7806 22.3213 11.999 22.418 12.1816C22.5182 12.3607 22.6579 12.4985 22.8369 12.5952C23.016 12.6919 23.2272 12.7402 23.4707 12.7402C23.7142 12.7402 23.9237 12.6919 24.0991 12.5952C24.2746 12.4985 24.4089 12.3607 24.502 12.1816C24.5986 11.999 24.647 11.7806 24.647 11.5264ZM25.9038 7.99219C25.9038 8.38607 25.8 8.73698 25.5923 9.04492C25.3846 9.34928 25.0964 9.5874 24.7275 9.75928C24.3623 9.93115 23.9434 10.0171 23.4707 10.0171C22.998 10.0171 22.5755 9.93115 22.2031 9.75928C21.8343 9.5874 21.5443 9.34928 21.333 9.04492C21.1253 8.73698 21.0215 8.38607 21.0215 7.99219C21.0215 7.52669 21.1271 7.13281 21.3384 6.81055C21.5496 6.4847 21.8379 6.23763 22.2031 6.06934C22.5719 5.90104 22.9909 5.81689 23.46 5.81689C23.9362 5.81689 24.3587 5.90104 24.7275 6.06934C25.0964 6.23763 25.3846 6.4847 25.5923 6.81055C25.8 7.13281 25.9038 7.52669 25.9038 7.99219ZM24.4858 8.05127C24.4858 7.82926 24.4447 7.6359 24.3623 7.47119C24.2799 7.3029 24.1618 7.1722 24.0078 7.0791C23.8574 6.986 23.6748 6.93945 23.46 6.93945C23.2523 6.93945 23.0732 6.98421 22.9229 7.07373C22.7725 7.16325 22.6561 7.29215 22.5737 7.46045C22.4914 7.62516 22.4502 7.8221 22.4502 8.05127C22.4502 8.27686 22.4914 8.4738 22.5737 8.64209C22.6561 8.81038 22.7725 8.94287 22.9229 9.03955C23.0768 9.13265 23.2594 9.1792 23.4707 9.1792C23.682 9.1792 23.8628 9.13265 24.0132 9.03955C24.1636 8.94287 24.2799 8.81038 24.3623 8.64209C24.4447 8.4738 24.4858 8.27686 24.4858 8.05127Z" fill="#8A4B04"/>
      </svg>
    );
  }

  if (band === "9-12") {
    return (
      <svg width="44" height="21" viewBox="0 0 44 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 10.25C0 4.58908 4.58908 0 10.25 0H32.9531C38.614 0 43.2031 4.58908 43.2031 10.25C43.2031 15.9109 38.614 20.5 32.9531 20.5H10.25C4.58908 20.5 0 15.9109 0 10.25Z" fill="#E3F5E3"/>
        <path d="M11.6328 12.6489H11.7349C12.1968 12.6489 12.5871 12.5898 12.9058 12.4717C13.228 12.3535 13.4876 12.187 13.6846 11.9722C13.8851 11.7537 14.0301 11.4941 14.1196 11.1934C14.2127 10.889 14.2593 10.5524 14.2593 10.1836V8.76562C14.2593 8.46484 14.2288 8.20166 14.168 7.97607C14.1071 7.74691 14.0212 7.55534 13.9102 7.40137C13.8027 7.2474 13.6756 7.13281 13.5288 7.05762C13.382 6.97884 13.2244 6.93945 13.0562 6.93945C12.87 6.93945 12.7052 6.98242 12.562 7.06836C12.4188 7.1543 12.297 7.27246 12.1968 7.42285C12.1001 7.56966 12.0249 7.73975 11.9712 7.93311C11.9211 8.12646 11.896 8.33057 11.896 8.54541C11.896 8.75309 11.9193 8.95182 11.9658 9.1416C12.016 9.33138 12.0894 9.49967 12.186 9.64648C12.2863 9.79329 12.4116 9.90967 12.562 9.99561C12.7124 10.078 12.8879 10.1191 13.0884 10.1191C13.2782 10.1191 13.45 10.0833 13.604 10.0117C13.7616 9.93652 13.8976 9.83805 14.0122 9.71631C14.1268 9.59098 14.2145 9.45312 14.2754 9.30273C14.3398 9.14876 14.3757 8.993 14.3828 8.83545L14.8823 9.05029C14.8823 9.31169 14.8268 9.5695 14.7158 9.82373C14.6084 10.078 14.4562 10.3089 14.2593 10.5166C14.0659 10.7207 13.8403 10.8854 13.5825 11.0107C13.3247 11.1934 13.0472 11.1934 12.75 11.1934C12.3812 11.1934 12.0553 11.1253 11.7725 10.9893C11.4896 10.8532 11.2515 10.6652 11.0581 10.4253C10.8683 10.1818 10.7251 9.90251 10.6284 9.5874C10.5317 9.26872 10.4834 8.92855 10.4834 8.56689C10.4834 8.19092 10.5425 7.83822 10.6606 7.50879C10.7788 7.17578 10.9489 6.88395 11.1709 6.6333C11.3965 6.37907 11.6686 6.18034 11.9873 6.03711C12.306 5.8903 12.6641 5.81689 13.0615 5.81689C13.4733 5.81689 13.8403 5.89746 14.1626 6.05859C14.4849 6.21973 14.7588 6.44352 14.9844 6.72998C15.21 7.01286 15.3818 7.34766 15.5 7.73438C15.6217 8.12109 15.6826 8.54362 15.6826 9.00195V9.50146C15.6826 9.98486 15.6343 10.4432 15.5376 10.8765C15.4409 11.3097 15.2923 11.7054 15.0918 12.0635C14.8913 12.4215 14.6353 12.7313 14.3237 12.9927C14.0158 13.2541 13.647 13.4564 13.2173 13.5996C12.7912 13.7393 12.3042 13.8091 11.7563 13.8091H11.6328V12.6489ZM19.7485 9.83984V10.9624H16.8105V9.83984H19.7485ZM24.5396 5.9082V13.75H23.1162V7.56787L21.231 8.19092V7.0415L24.3784 5.9082H24.5396ZM32.4673 12.6328V13.75H27.1714V12.7939L29.7119 10.0493C29.9769 9.74854 30.1864 9.48714 30.3403 9.26514C30.4943 9.04313 30.6035 8.84261 30.668 8.66357C30.736 8.48096 30.77 8.30729 30.77 8.14258C30.77 7.90267 30.7271 7.6932 30.6411 7.51416C30.5552 7.33154 30.4299 7.1901 30.2651 7.08984C30.104 6.98958 29.9053 6.93945 29.6689 6.93945C29.4076 6.93945 29.1838 7.00033 28.9976 7.12207C28.8149 7.24023 28.6753 7.40495 28.5786 7.61621C28.4855 7.82747 28.439 8.06917 28.439 8.34131H27.0156C27.0156 7.87939 27.123 7.45866 27.3379 7.0791C27.5527 6.69596 27.8607 6.38981 28.2617 6.16064C28.6628 5.93148 29.139 5.81689 29.6904 5.81689C30.2275 5.81689 30.6823 5.90641 31.0547 6.08545C31.4271 6.2609 31.71 6.51156 31.9033 6.8374C32.0967 7.16325 32.1934 7.55176 32.1934 8.00293C32.1934 8.25358 32.1522 8.50065 32.0698 8.74414C31.9875 8.98763 31.8711 9.22933 31.7207 9.46924C31.5739 9.70557 31.3984 9.94548 31.1943 10.189C30.9902 10.4325 30.7629 10.6813 30.5122 10.9355L28.9868 12.6328H32.4673Z" fill="#1D6B1D"/>
      </svg>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
      {band}
    </span>
  );
}

// ─── Stat Cell ────────────────────────────────────────────────────────────────

function StatCell({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col justify-between w-full h-[76px] pt-[10px] pr-[13px] pb-[8px] pl-[13px] bg-white rounded-[12px] border-t-[3px] border-r border-b border-l border-t-[#D1D5DB] border-r-[#E8E6E1] border-b-[#E8E6E1] border-l-[#E8E6E1] opacity-100 min-w-0 font-sans"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium truncate leading-none">{label}</span>
        <span className="text-slate-300 shrink-0 flex items-center justify-center">{icon}</span>
      </div>
      <span className="text-2xl font-bold text-slate-800 leading-none">{value}</span>
    </div>
  );
}

// ─── Instrument Card ──────────────────────────────────────────────────────────

function InstrumentCard({
  instrument,
  onViewInstrument,
}: {
  instrument: SurveyInstrument;
  onViewInstrument: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative w-full h-[313px] bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between opacity-100">
      {/* Top Gradient Bar */}
      <div
        className="w-full h-1 shrink-0"
        style={{ background: instrument.topGradient }}
      />

      <div className="p-6 flex flex-col justify-between flex-1 min-h-0">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 pb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-['Inter'] font-bold text-[18px] leading-[27px] tracking-[0px] align-middle text-slate-800">
              {instrument.name}
            </h3>
            <GradeBadge band={instrument.gradeBand} />
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Active ×{instrument.activeVersionCount}
            </span>
          </div>
          <p className="font-['Roboto'] font-normal text-[13px] leading-[19.5px] tracking-[0px] align-middle text-slate-400 mt-1">
            Active since {instrument.activeSince} · {instrument.questionTypes}
          </p>
        </div>

        {/* Kebab menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E8E6E1] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] py-1 z-40">
                <button className="w-full text-left px-4 py-2.5 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors">
                  Disable instrument
                </button>
                <button className="w-full text-left px-4 py-2.5 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors">
                  View history
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-4 gap-3 pb-4">
        <StatCell
          label="Questions"
          value={instrument.questions}
          icon={
            <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12C4 5.37258 9.37258 0 16 0C22.6274 0 28 5.37258 28 12C28 18.6274 22.6274 24 16 24C9.37258 24 4 18.6274 4 12Z" fill="#E3F0E3"/>
              <path d="M16 17C15.32 17 14.67 16.87 14.05 16.61C13.4567 16.3567 12.9283 15.9983 12.465 15.535C12.0017 15.0717 11.6433 14.5433 11.39 13.95C11.13 13.33 11 12.68 11 12C11 11.32 11.13 10.67 11.39 10.05C11.6433 9.45667 12.0017 8.92833 12.465 8.465C12.9283 8.00167 13.4567 7.64333 14.05 7.39C14.67 7.13 15.32 7 16 7C16.68 7 17.33 7.13 17.95 7.39C18.5433 7.64333 19.0717 8.00167 19.535 8.465C19.9983 8.92833 20.3567 9.45667 20.61 10.05C20.87 10.67 21 11.32 21 12C21 12.68 20.87 13.33 20.61 13.95C20.3567 14.5433 19.9983 15.0717 19.535 15.535C19.0717 15.9983 18.5433 16.3567 17.95 16.61C17.33 16.87 16.68 17 16 17ZM16 16C16.7267 16 17.4 15.8167 18.02 15.45C18.62 15.0967 19.0967 14.62 19.45 14.02C19.8167 13.4 20 12.7267 20 12C20 11.2733 19.8167 10.6 19.45 9.98C19.0967 9.38 18.62 8.90333 18.02 8.55C17.4 8.18333 16.7267 8 16 8C15.2733 8 14.6 8.18333 13.98 8.55C13.38 8.90333 12.9033 9.38 12.55 9.98C12.1833 10.6 12 11.2733 12 12C12 12.7267 12.1833 13.4 12.55 14.02C12.9033 14.62 13.38 15.0967 13.98 15.45C14.6 15.8167 15.2733 16 16 16ZM15.5 13.5H16.5V14.5H15.5V13.5ZM16.5 12.68V13H15.5V12.25C15.5 12.11 15.5483 11.9917 15.645 11.895C15.7417 11.7983 15.86 11.75 16 11.75C16.2067 11.75 16.3833 11.6767 16.53 11.53C16.6767 11.3833 16.75 11.2067 16.75 11C16.75 10.7933 16.6767 10.6167 16.53 10.47C16.3833 10.3233 16.2067 10.25 16 10.25C15.82 10.25 15.6617 10.3067 15.525 10.42C15.3883 10.5333 15.3 10.6767 15.26 10.85L14.28 10.66C14.3333 10.3933 14.4433 10.1533 14.61 9.94C14.7767 9.72667 14.98 9.55833 15.22 9.435C15.46 9.31167 15.72 9.25 16 9.25C16.32 9.25 16.6133 9.32833 16.88 9.485C17.1467 9.64167 17.3583 9.85333 17.515 10.12C17.6717 10.3867 17.75 10.68 17.75 11C17.75 11.3933 17.6333 11.7433 17.4 12.05C17.1667 12.3567 16.8667 12.5667 16.5 12.68Z" fill="#586D4D"/>
            </svg>
          }
        />
        <StatCell
          label="Versions"
          value={instrument.activeVersionCount + instrument.retiredVersionCount}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z" fill="#F0EAFB"/>
              <path d="M9.55 13.61C9.83 13.7167 10.0583 13.8967 10.235 14.15C10.4117 14.4033 10.5 14.6867 10.5 15C10.5 15.2733 10.4333 15.525 10.3 15.755C10.1667 15.985 9.985 16.1667 9.755 16.3C9.525 16.4333 9.27333 16.5 9 16.5C8.72667 16.5 8.475 16.4333 8.245 16.3C8.015 16.1667 7.83333 15.985 7.7 15.755C7.56667 15.525 7.5 15.2733 7.5 15C7.5 14.68 7.59333 14.39 7.78 14.13C7.96667 13.87 8.20667 13.69 8.5 13.59V10.41C8.20667 10.31 7.96667 10.13 7.78 9.87C7.59333 9.61 7.5 9.32 7.5 9C7.5 8.72667 7.56667 8.475 7.7 8.245C7.83333 8.015 8.015 7.83333 8.245 7.7C8.475 7.56667 8.72667 7.5 9 7.5C9.27333 7.5 9.525 7.56667 9.755 7.7C9.985 7.83333 10.1667 8.015 10.3 8.245C10.4333 8.475 10.5 8.72667 10.5 9C10.5 9.32 10.4067 9.61 10.22 9.87C10.0333 10.13 9.79333 10.31 9.5 10.41V12C9.71333 11.84 9.94667 11.7167 10.2 11.63C10.4533 11.5433 10.72 11.5 11 11.5H13C13.34 11.5 13.645 11.3967 13.915 11.19C14.185 10.9833 14.3633 10.7167 14.45 10.39C14.17 10.2833 13.9417 10.1033 13.765 9.85C13.5883 9.59667 13.5 9.31333 13.5 9C13.5 8.72667 13.5667 8.475 13.7 8.245C13.8333 8.015 14.015 7.83333 14.245 7.7C14.475 7.56667 14.7267 7.5 15 7.5C15.2733 7.5 15.525 7.56667 15.755 7.7C15.985 7.83333 16.1667 8.015 16.3 8.245C16.4333 8.475 16.5 8.72667 16.5 9C16.5 9.32667 16.4033 9.62167 16.21 9.885C16.0167 10.1483 15.7667 10.33 15.46 10.43C15.3933 10.8167 15.2433 11.1683 15.01 11.485C14.7767 11.8017 14.485 12.05 14.135 12.23C13.785 12.41 13.4067 12.5 13 12.5H11C10.66 12.5 10.355 12.6033 10.085 12.81C9.815 13.0167 9.63667 13.2833 9.55 13.61ZM9 14.5C8.86 14.5 8.74167 14.5483 8.645 14.645C8.54833 14.7417 8.5 14.86 8.5 15C8.5 15.14 8.54833 15.2583 8.645 15.355C8.74167 15.4517 8.86 15.5 9 15.5C9.14 15.5 9.25833 15.4517 9.355 15.355C9.45167 15.2583 9.5 15.14 9.5 15C9.5 14.86 9.45167 14.7417 9.355 14.645C9.25833 14.5483 9.14 14.5 9 14.5ZM9 8.5C8.86 8.5 8.74167 8.54833 8.645 8.645C8.54833 8.74167 8.5 8.86 8.5 9C8.5 9.14 8.54833 9.25833 8.645 9.355C8.74167 9.45167 8.86 9.5 9 9.5C9.14 9.5 9.25833 9.45167 9.355 9.355C9.45167 9.25833 9.5 9.14 9.5 9C9.5 8.86 9.45167 8.74167 9.355 8.645C9.25833 8.54833 9.14 8.5 9 8.5ZM15 8.5C14.86 8.5 14.7417 8.54833 14.645 8.645C14.5483 8.74167 14.5 8.86 14.5 9C14.5 9.14 14.5483 9.25833 14.645 9.355C14.7417 9.45167 14.86 9.5 15 9.5C15.14 9.5 15.2583 9.45167 15.355 9.355C15.4517 9.25833 15.5 9.14 15.5 9C15.5 8.86 15.4517 8.74167 15.355 8.645C15.2583 8.54833 15.14 8.5 15 8.5Z" fill="#6D28D9"/>
            </svg>
          }
        />
        <StatCell
          label="Schools using"
          value={instrument.schoolsUsing}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z" fill="#2563EB" fillOpacity="0.1"/>
              <path d="M16.5 15.5H17.5V16.5H6.5V15.5H7.5V8C7.5 7.86 7.54833 7.74167 7.645 7.645C7.74167 7.54833 7.86 7.5 8 7.5H13C13.14 7.5 13.2583 7.54833 13.355 7.645C13.4517 7.74167 13.5 7.86 13.5 8V15.5H15.5V11.5H14.5V10.5H16C16.14 10.5 16.2583 10.5483 16.355 10.645C16.4517 10.7417 16.5 10.86 16.5 11V15.5ZM8.5 8.5V15.5H12.5V8.5H8.5ZM9.5 11.5H11.5V12.5H9.5V11.5ZM9.5 9.5H11.5V10.5H9.5V9.5Z" fill="#1A5C7A"/>
            </svg>
          }
        />
        <StatCell
          label="Live"
          value={instrument.liveCount}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z" fill="#FFECD1"/>
              <path d="M15.18 8.82L14.47 9.53C14.15 9.20333 13.78 8.95333 13.36 8.78C12.9267 8.59333 12.4733 8.5 12 8.5C11.3667 8.5 10.7767 8.66 10.23 8.98C9.70333 9.28667 9.28667 9.70333 8.98 10.23C8.66 10.7767 8.5 11.3667 8.5 12C8.5 12.6333 8.66 13.2233 8.98 13.77C9.28667 14.2967 9.70333 14.7133 10.23 15.02C10.7767 15.34 11.3667 15.5 12 15.5C12.6333 15.5 13.2233 15.34 13.77 15.02C14.2967 14.7133 14.7133 14.2967 15.02 13.77C15.34 13.2233 15.5 12.6333 15.5 12H16.5C16.5 12.8133 16.2967 13.57 15.89 14.27C15.49 14.95 14.95 15.49 14.27 15.89C13.57 16.2967 12.8133 16.5 12 16.5C11.1867 16.5 10.43 16.2967 9.73 15.89C9.05 15.49 8.51 14.95 8.11 14.27C7.70333 13.57 7.5 12.8133 7.5 12C7.5 11.1867 7.70333 10.43 8.11 9.73C8.51 9.05 9.05 8.51 9.73 8.11C10.43 7.70333 11.1867 7.5 12 7.5C12.6133 7.5 13.1967 7.61667 13.75 7.85C14.29 8.08333 14.7667 8.40667 15.18 8.82Z" fill="#8A4B04"/>
            </svg>
          }
        />
      </div>

      {/* Formats row */}
      <div className="pt-3 border-t border-[#F0EDE8]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium mr-0.5">Formats:</span>
          {instrument.formats.map((f) => (
            <FormatPill key={f} label={f} />
          ))}
          <span className="text-[11px] text-slate-400 font-medium ml-2 mr-0.5">Versions:</span>
          {instrument.versions.map((v) => (
            <span
              key={v.id}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap opacity-60"
              style={{
                backgroundColor: v.status === "Active" ? "#F3F4F6" : "#F9FAFB",
                color: "#6B7280",
              }}
            >
              {v.name}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons Below Formats */}
      <div className="flex items-center gap-3 pt-4 shrink-0">
        <Button
          variant="default"
          size="sm"
          className="rounded-full bg-[#526D4E] hover:bg-[#435A40] text-white text-[13px] font-semibold gap-1.5 h-9 px-5"
          onClick={onViewInstrument}
        >
          <Eye className="w-4 h-4" />
          View instrument
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-[13px] font-semibold gap-1.5 h-9 px-5 border-[#E8E6E1] bg-[#F2F5F0] text-[#586D4D] hover:bg-[#E6EBE3]"
        >
          <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.1203 11.6667C13.1203 11.83 13.0639 11.9681 12.9512 12.0808C12.8384 12.1936 12.7004 12.25 12.5371 12.25H2.04089C1.87761 12.25 1.73961 12.1936 1.62687 12.0808C1.51413 11.9681 1.45776 11.83 1.45776 11.6667V2.33333C1.45776 2.17 1.51413 2.03194 1.62687 1.91917C1.73961 1.80639 1.87761 1.75 2.04089 1.75H12.5371C12.7004 1.75 12.8384 1.80639 12.9512 1.91917C13.0639 2.03194 13.1203 2.17 13.1203 2.33333V11.6667ZM6.70589 8.75H2.62401V11.0833H6.70589V8.75ZM11.954 6.41667H7.87214V11.0833H11.954V6.41667ZM6.70589 2.91667H2.62401V7.58333H6.70589V2.91667ZM11.954 2.91667H7.87214V5.25H11.954V2.91667Z" fill="#586D4D"/>
          </svg>
          Preview
        </Button>
      </div>
      </div>
    </div>
  );
}

// ─── Elementary Questions Mock Data ──────────────────────────────────────────

const ELEMENTARY_QUESTIONS = [
  // Rating (Yes / Sometimes / No) - 11 questions
  { id: "Q1", type: "Rating", text: "The food tastes good.", category: "Rating (Yes / Sometimes / No)" },
  { id: "Q2", type: "Rating", text: "The food looks yummy, clean & good.", category: "Rating (Yes / Sometimes / No)" },
  { id: "Q3", type: "Rating", text: "The food is of good taste, looks delicious, has good smell & is hot.", category: "Rating (Yes / Sometimes / No)" },
  { id: "Q4", type: "Rating", text: "There are different choices with various components.", category: "Rating (Yes / Sometimes / No)" },
  { id: "Q5", type: "Rating", text: "Information about food is clear.", category: "Rating (Yes / Sometimes / No)" },
  { id: "Q6", type: "Rating", text: "The people who serve the food are friendly.", category: "Rating (Yes / Sometimes / No)" },
  { id: "Q7", type: "Rating", text: "The cafeteria is clean.", category: "Rating (Yes / Sometimes / No)" },
  { id: "Q8", type: "Rating", text: "The cafeteria is not too noisy.", category: "Rating (Yes / Sometimes / No)" },
  { id: "Q9", type: "Rating", text: "I have enough time to eat my food.", category: "Rating (Yes / Sometimes / No)" },
  { id: "Q10", type: "Rating", text: "The food options are healthy and nutritious.", category: "Rating (Yes / Sometimes / No)" },
  { id: "Q11", type: "Rating", text: "The sliding tray section is clean.", category: "Rating (Yes / Sometimes / No)" },

  // Multi-select / Single-select - 8 questions
  { id: "Q12", type: "Multi-select", text: "What grades are you in?", choices: ["K", "1", "2", "3", "4", "5"], category: "Multi-select / Single-select" },
  { id: "Q13", type: "Single-select", text: "I eat lunch provided by: Cafeteria...", choices: ["Always", "Often", "Seldom", "Never"], category: "Multi-select / Single-select" },
  { id: "Q14", type: "Multi-select", text: "Look at the list of...", choices: ["Always", "Often", "Seldom", "Never"], category: "Multi-select / Single-select" },
  { id: "Q15", type: "Single-select", text: "What do you like most during breakfast/lunch?", choices: ["Entrance", "Salad bar", "Main line"], category: "Multi-select / Single-select" },
  { id: "Q16", type: "Single-select", text: "What area do you eat breakfast/lunch?", choices: ["Indoor Cafeteria", "Outdoor seating area", "Classroom/Hallway"], category: "Multi-select / Single-select" },
  { id: "Q17", type: "Single-select", text: "What do you like to eat during breakfast/lunch?", choices: ["Fruits and vegetables", "Sandwiches", "Warm main dish"], category: "Multi-select / Single-select" },
  { id: "Q18", type: "Single-select", text: "What would help you eat at school/cafeteria?", choices: ["Short lines", "More food options", "Friends to eat with"], category: "Multi-select / Single-select" },
  { id: "Q19", type: "Single-select", text: "What is most important to you?", choices: ["Cleanliness", "Taste", "Staff"], category: "Multi-select / Single-select" },

  // Open-ended - 3 questions
  { id: "Q20", type: "Open-ended", text: "What are your favorite foods?", category: "Open-ended" },
  { id: "Q21", type: "Open-ended", text: "What would you change about the cafeteria?", category: "Open-ended" },
  { id: "Q22", type: "Open-ended", text: "Any other comments?", category: "Open-ended" }
];

const getTopicBadge = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes("taste") || t.includes("delicious") || t.includes("yummy")) return "Taste";
  if (t.includes("fresh")) return "Freshness";
  if (t.includes("choice") || t.includes("various")) return "Variety";
  if (t.includes("time")) return "Time to eat";
  if (t.includes("clean")) return "Cleanliness";
  if (t.includes("friendly") || t.includes("serve")) return "Staff";
  if (t.includes("noisy")) return "Atmosphere";
  if (t.includes("health") || t.includes("nutritious")) return "Health";
  if (t.includes("information") || t.includes("clear")) return "Information";
  return null;
};

// ─── Preview View Component ───────────────────────────────────────────────────

interface PreviewViewProps {
  instrument: SurveyInstrument;
  onBack: () => void;
}

function PreviewView({ instrument, onBack }: PreviewViewProps) {
  const [viewport, setViewport] = useState<"Phone" | "Tablet" | "Desktop">("Phone");

  // Pick the correct preview URL based on the instrument's grade band.
  // For K-5 we use north-hills-elementary (open status), others fall back gracefully.
  const previewUrl =
    instrument.gradeBand === "K-5"
      ? "/survey/north-hills-elementary"
      : instrument.gradeBand === "6-8"
      ? "/survey/sample-middle"
      : "/survey/westview-high";

  return (
    <div className="space-y-4 w-full pb-10 font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-400 mb-3 select-none">
        <span className="hover:text-slate-600 cursor-pointer">Surveys</span>
        <span>/</span>
        <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>{instrument.gradeBand} Instrument</span>
        <span>/</span>
        <span className="text-slate-800 font-bold">Preview as student</span>
      </div>

      {/* Preview banner */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#F5F3FF] border border-[#E5DEFF] rounded-xl px-4 py-3">
        {/* Left: icon + text */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Eye className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-[#5B21B6]">
              Preview&nbsp;&nbsp;{instrument.gradeBand} Instrument v3 (Active)
            </p>
            <p className="text-[12px] text-[#7C3AED] mt-0.5">
              This is a read-only preview. No responses are saved.
            </p>
          </div>
        </div>

        {/* Center: viewport tabs */}
        <div className="flex items-center bg-white border border-[#E5DEFF] rounded-full p-0.5 gap-0.5 shrink-0">
          {(["Phone", "Tablet", "Desktop"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setViewport(tab)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                viewport === tab
                  ? "bg-[#7C3AED] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "Phone" && <Smartphone className="w-3.5 h-3.5" />}
              {tab === "Tablet" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                  <circle cx="12" cy="17" r="1"/>
                </svg>
              )}
              {tab === "Desktop" && <Monitor className="w-3.5 h-3.5" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Right: Back to instrument */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-slate-600 bg-white border border-[#E8E6E1] rounded-full hover:bg-slate-50 transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to instrument
        </button>
      </div>

      {/* Preview canvas */}
      <div className="w-full flex items-start justify-center pt-6 px-4">

        {/* ── Phone ── */}
        {viewport === "Phone" && (
          <div className="flex flex-col items-center w-full max-w-[390px]">
            <div
              className="w-full rounded-2xl overflow-hidden border border-[#E8E6E1] shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
              style={{ height: 720 }}
            >
              <iframe
                src={previewUrl}
                title={`Student survey preview – Phone (${instrument.gradeBand})`}
                style={{ width: "100%", height: "100%", border: "none", background: "#faf9f6" }}
                scrolling="yes"
              />
            </div>
            <p className="mt-4 text-[11px] text-slate-400 font-medium tracking-wide uppercase">Mobile · Max 390 px</p>
          </div>
        )}

        {/* ── Tablet ── */}
        {viewport === "Tablet" && (
          <div className="flex flex-col items-center w-full">
            {/* Wrapper that handles scaled dimensions to prevent empty space around the scaled element */}
            <div className="w-full flex justify-center overflow-hidden h-[420px] sm:h-[630px] md:h-[840px]">
              <div
                className="rounded-2xl overflow-hidden border border-[#E8E6E1] shadow-[0_4px_24px_rgba(0,0,0,0.08)] origin-top shrink-0
                           w-[768px] h-[840px]
                           scale-[0.5] sm:scale-[0.75] md:scale-100"
              >
                <iframe
                  src={previewUrl}
                  title={`Student survey preview – Tablet (${instrument.gradeBand})`}
                  style={{ width: "100%", height: "100%", border: "none", background: "#faf9f6" }}
                  scrolling="yes"
                />
              </div>
            </div>
            <p className="mt-4 text-[11px] text-slate-400 font-medium tracking-wide uppercase">Tablet · Simulated 768 px</p>
          </div>
        )}

        {/* ── Desktop ── */}
        {viewport === "Desktop" && (
          <div className="flex flex-col items-center w-full">
            {/* Wrapper that handles scaled desktop element to fit mobile/tablets */}
            <div className="w-full flex justify-center overflow-hidden h-[230px] sm:h-[340px] md:h-[510px] lg:h-[680px]">
              <div
                className="rounded-2xl overflow-hidden border border-[#E8E6E1] shadow-[0_4px_24px_rgba(0,0,0,0.08)] origin-top shrink-0
                           w-[1024px] h-[680px]
                           scale-[0.33] sm:scale-[0.5] md:scale-[0.75] lg:scale-100"
              >
                <iframe
                  src={previewUrl}
                  title={`Student survey preview – Desktop (${instrument.gradeBand})`}
                  style={{ width: "100%", height: "100%", border: "none", background: "#faf9f6" }}
                  scrolling="yes"
                />
              </div>
            </div>
            <p className="mt-4 text-[11px] text-slate-400 font-medium tracking-wide uppercase">Desktop · Simulated 1024 px</p>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── View Instrument View Component ───────────────────────────────────────────

interface ViewInstrumentViewProps {
  instrument: SurveyInstrument;
  onBack: () => void;
  onChangeInstrument: (inst: SurveyInstrument) => void;
}

function ViewInstrumentView({ instrument, onBack, onChangeInstrument }: ViewInstrumentViewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [formatFilter, setFormatFilter] = useState("All formats");
  const [formatDropdownOpen, setFormatDropdownOpen] = useState(false);
  const [instDropdownOpen, setInstDropdownOpen] = useState(false);
  const [versionDropdownOpen, setVersionDropdownOpen] = useState(false);

  const categories = [
    { name: "Rating (Yes / Sometimes / No)", count: 11, dot: "#4D1C9A" },
    { name: "Multi-select / Single-select", count: 8, dot: "#1A5C7A" },
    { name: "Open-ended", count: 3, dot: "#6D6D6D" }
  ];

  const filteredQuestions = useMemo(() => {
    let list = ELEMENTARY_QUESTIONS;
    if (formatFilter === "Rating") {
      return list.filter((q) => q.type === "Rating");
    } else if (formatFilter === "Single-select") {
      return list.filter((q) => q.type === "Single-select");
    } else if (formatFilter === "Multi-select") {
      return list.filter((q) => q.type === "Multi-select");
    } else if (formatFilter === "Open-ended") {
      return list.filter((q) => q.type === "Open-ended");
    }
    return list;
  }, [formatFilter]);

  const instOptions = [
    { value: "K-5 Instrument", label: "K-5 Instrument", dot: "#7C3AED" },
    { value: "6-8 Instrument", label: "6-8 Instrument", dot: "#8A4B04" },
    { value: "9-12 Instrument", label: "9-12 Instrument", dot: "#1D6B1D" }
  ];

  const formatOptions = [
    { value: "All formats", label: "All formats", hasDot: false },
    { value: "Rating", label: "3-point", hasDot: true, dot: "#7C3AED" },
    { value: "Single-select", label: "Single-select", hasDot: true, dot: "#8A4B04" },
    { value: "Multi-select", label: "Multi-select", hasDot: true, dot: "#1A5C7A" },
    { value: "Open-ended", label: "Open-ended", hasDot: true, dot: "#6D6D6D" }
  ];

  if (showPreview) {
    return <PreviewView instrument={instrument} onBack={() => setShowPreview(false)} />;
  }

  return (
    <div className="space-y-4 w-full pb-10 font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-400 mb-3 select-none">
        <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>Surveys</span>
        <span>/</span>
        <span className="text-slate-800 font-bold">K-5 Instrument</span>
      </div>

      {/* Header and Controls Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-[#F0EDE8]">
        {/* Left filter actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Instrument drop */}
          <div className="relative">
            <button 
              onClick={() => setInstDropdownOpen(!instDropdownOpen)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-bold text-slate-700 bg-white border border-[#E8E6E1] rounded-full hover:bg-slate-50 transition-colors"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: instOptions.find(o => o.value === `${instrument.gradeBand} Instrument`)?.dot || "#7C3AED" }} />
              {instrument.gradeBand} Instrument
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>
            {instDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setInstDropdownOpen(false)} />
                <div className="absolute left-0 mt-1.5 w-48 bg-white border border-[#E8E6E1] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] py-1 z-20 overflow-hidden font-sans">
                  {instOptions.map((opt) => {
                    const isSelected = opt.value === `${instrument.gradeBand} Instrument`;
                    return (
                      <button
                        key={opt.value}
                        className={`flex items-center justify-between w-full px-4 py-2.5 text-[13px] font-semibold text-left transition-colors ${
                          isSelected ? "bg-[#F0EAFB] text-[#4D1C9A]" : "text-slate-600 hover:bg-slate-50"
                        }`}
                        onClick={() => {
                          const targetGradeBand = opt.value.split(" ")[0];
                          const targetInst = INSTRUMENTS.find(i => i.gradeBand === targetGradeBand);
                          if (targetInst) {
                            onChangeInstrument(targetInst);
                          }
                          setInstDropdownOpen(false);
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: opt.dot }} />
                          {opt.label}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#4D1C9A] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Version drop */}
          <div className="relative">
            <button 
              onClick={() => setVersionDropdownOpen(!versionDropdownOpen)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-slate-600 bg-white border border-[#E8E6E1] rounded-full hover:bg-slate-50 transition-colors"
            >
              Version 3
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>
            {versionDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setVersionDropdownOpen(false)} />
                <div className="absolute left-0 mt-1.5 w-48 bg-white border border-[#E8E6E1] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] py-1 z-20 overflow-hidden font-sans">
                  {[
                    { value: "v3", label: "Version 3", active: true },
                    { value: "v2", label: "Version 2", active: false },
                    { value: "v1", label: "Version 1", active: false }
                  ].map((v) => {
                    const isSelected = v.value === "v3";
                    return (
                      <button
                        key={v.value}
                        className={`flex items-center justify-between w-full px-4 py-2.5 text-[13px] font-semibold text-left transition-colors ${
                          isSelected ? "bg-[#F0EAFB] text-[#4D1C9A]" : "text-slate-600 hover:bg-slate-50"
                        }`}
                        onClick={() => setVersionDropdownOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          {v.label}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#4D1C9A] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Format drop */}
          <div className="relative">
            <button 
              onClick={() => setFormatDropdownOpen(!formatDropdownOpen)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-slate-600 bg-white border border-[#E8E6E1] rounded-full hover:bg-slate-50 transition-colors"
            >
              <span className="text-slate-400 font-normal">Format :</span>
              <span className="font-bold text-slate-700">
                {formatFilter === "Rating" ? "3-point" : formatFilter}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>
            {formatDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setFormatDropdownOpen(false)} />
                <div className="absolute left-0 mt-1.5 w-48 bg-white border border-[#E8E6E1] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] py-1 z-20 overflow-hidden font-sans">
                  {formatOptions.map((opt) => {
                    const isSelected = opt.value === formatFilter;
                    return (
                      <button
                        key={opt.value}
                        className={`flex items-center justify-between w-full px-4 py-2.5 text-[13px] font-semibold text-left transition-colors ${
                          isSelected ? "bg-[#F0EAFB] text-[#4D1C9A]" : "text-slate-600 hover:bg-slate-50"
                        }`}
                        onClick={() => {
                          setFormatFilter(opt.value);
                          setFormatDropdownOpen(false);
                        }}
                      >
                        <span className="flex items-center gap-2">
                          {opt.hasDot && (
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: opt.dot }} />
                          )}
                          {opt.label}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#4D1C9A] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Right action buttons */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <button className="flex items-center gap-1.5 text-[13px] font-semibold text-purple-700 hover:text-purple-900 px-3 py-1.5 transition-colors">
            <RefreshCw className="w-4 h-4 text-purple-600 rotate-180" />
            Version history
          </button>

          <button className="flex items-center gap-1.5 text-[13px] font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 transition-colors">
            <Trash2 className="w-4 h-4 text-red-400" />
            Retire
          </button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setShowPreview(true)}
            className="rounded-full bg-[#586D4D] hover:bg-[#435A40] text-white text-[13px] font-semibold gap-1.5 h-9 px-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
          >
            <Eye className="w-4 h-4 text-white" />
            Preview
          </Button>
        </div>
      </div>

      {/* Purple banner */}
      <div className="flex items-start gap-3 bg-[#F5F3FF] border border-[#E5DEFF] rounded-xl px-4 py-3.5">
        <Info className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-[#5B21B6]">
            Survey instruments are authored and provided by the client and can't be edited here.
          </p>
          <p className="text-[12px] text-[#7C3AED] mt-0.5">
            For changes to question text, type, or options, submit a request through the client process.
          </p>
        </div>
      </div>

      {/* Main Grid: list & sidebar */}
      <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
        {/* Left pane: questions */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {categories.map((cat) => {
            const catQuestions = filteredQuestions.filter(q => q.category === cat.name);
            if (catQuestions.length === 0) return null;

            return (
              <div key={cat.name} className="space-y-3">
                <h3 className="flex items-center gap-2 font-bold text-[14px] text-slate-800 pl-1 font-sans">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.dot }} />
                  {cat.name}
                  <span className="text-slate-400 font-normal text-[13px] ml-1">
                    {catQuestions.length} questions
                  </span>
                </h3>
                
                <div className="space-y-3">
                  {catQuestions.map((q) => (
                    <div 
                      key={q.id} 
                      className="w-full min-h-[147px] p-[20px] relative overflow-hidden bg-white border border-[#E8E6E1] rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex flex-col gap-2.5 opacity-100"
                    >
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-[4px]" 
                        style={{ backgroundColor: q.type === "Rating" ? "#4D1C9A" : q.type === "Single-select" ? "#8A4B04" : q.type === "Multi-select" ? "#1A5C7A" : q.type === "Open-ended" ? "#6D6D6D" : "transparent" }} 
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-['Roboto'] font-semibold text-[13px] leading-[19.5px] align-middle text-[#9A9A9A] uppercase">
                            {q.id}
                          </span>
                          <div className="w-[1px] h-[12px] bg-[#E8E6E1]" />
                          {q.type === "Rating" ? (
                            <div className="flex items-center gap-2">
                              <svg width="51" height="21" viewBox="0 0 51 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 10.25C0 4.58908 4.58908 0 10.25 0H40.6562C46.3172 0 50.9062 4.58908 50.9062 10.25C50.9062 15.9109 46.3172 20.5 40.6562 20.5H10.25C4.58908 20.5 0 15.9109 0 10.25Z" fill="#F0EAFB"/>
                                <path d="M10.1108 9.25439H10.8843C11.1851 9.25439 11.4339 9.20247 11.6309 9.09863C11.8314 8.99479 11.98 8.85156 12.0767 8.66895C12.1733 8.48633 12.2217 8.27686 12.2217 8.04053C12.2217 7.79346 12.1769 7.58219 12.0874 7.40674C12.0015 7.2277 11.869 7.08984 11.6899 6.99316C11.5145 6.89648 11.2907 6.84814 11.0186 6.84814C10.7894 6.84814 10.5817 6.89469 10.3955 6.98779C10.2129 7.07731 10.0679 7.20622 9.96045 7.37451C9.85303 7.53923 9.79932 7.73617 9.79932 7.96533H8.49951C8.49951 7.54997 8.60872 7.18115 8.82715 6.85889C9.04557 6.53662 9.34277 6.28418 9.71875 6.10156C10.0983 5.91536 10.5244 5.82227 10.9971 5.82227C11.502 5.82227 11.9424 5.90641 12.3184 6.07471C12.6979 6.23942 12.9933 6.48649 13.2046 6.81592C13.4159 7.14535 13.5215 7.55355 13.5215 8.04053C13.5215 8.26253 13.4696 8.48812 13.3657 8.71729C13.2619 8.94645 13.1079 9.15592 12.9038 9.3457C12.6997 9.5319 12.4455 9.68408 12.1411 9.80225C11.8368 9.91683 11.484 9.97412 11.083 9.97412H10.1108V9.25439ZM10.1108 10.2642V9.55518H11.083C11.5413 9.55518 11.9316 9.60889 12.2539 9.71631C12.5798 9.82373 12.8447 9.97233 13.0488 10.1621C13.2529 10.3483 13.4015 10.5614 13.4946 10.8013C13.5913 11.0412 13.6396 11.2954 13.6396 11.564C13.6396 11.9292 13.5734 12.255 13.4409 12.5415C13.312 12.8244 13.1276 13.0643 12.8877 13.2612C12.6478 13.4582 12.3667 13.6068 12.0444 13.707C11.7257 13.8073 11.3784 13.8574 11.0024 13.8574C10.6659 13.8574 10.3436 13.8109 10.0356 13.7178C9.7277 13.6247 9.45199 13.4868 9.2085 13.3042C8.96501 13.118 8.77165 12.887 8.62842 12.6113C8.48877 12.332 8.41895 12.0098 8.41895 11.6445H9.71338C9.71338 11.8773 9.76709 12.0832 9.87451 12.2622C9.98551 12.4377 10.1395 12.5755 10.3364 12.6758C10.5369 12.776 10.7661 12.8262 11.0239 12.8262C11.2961 12.8262 11.5306 12.7778 11.7275 12.6812C11.9245 12.5845 12.0749 12.4412 12.1787 12.2515C12.2861 12.0617 12.3398 11.8325 12.3398 11.564C12.3398 11.2596 12.2808 11.0125 12.1626 10.8228C12.0444 10.633 11.8761 10.4933 11.6577 10.4038C11.4393 10.3107 11.1815 10.2642 10.8843 10.2642H10.1108ZM17.5229 9.89355V10.9248H14.6816V9.89355H17.5229ZM19.9561 9.05566V15.9844H18.6616V7.93848H19.854L19.9561 9.05566ZM23.7427 10.7905V10.9033C23.7427 11.3258 23.6925 11.7179 23.5923 12.0796C23.4956 12.4377 23.3506 12.751 23.1572 13.0195C22.9674 13.2845 22.7329 13.4904 22.4536 13.6372C22.1743 13.784 21.8521 13.8574 21.4868 13.8574C21.1252 13.8574 20.8083 13.7912 20.5361 13.6587C20.2676 13.5226 20.0402 13.3311 19.854 13.084C19.6678 12.8369 19.5174 12.5469 19.4028 12.2139C19.2918 11.8773 19.2131 11.5085 19.1665 11.1074V10.6724C19.2131 10.2463 19.2918 9.85954 19.4028 9.51221C19.5174 9.16488 19.6678 8.86589 19.854 8.61523C20.0402 8.36458 20.2676 8.17122 20.5361 8.03516C20.8047 7.89909 21.118 7.83105 21.4761 7.83105C21.8413 7.83105 22.1654 7.90267 22.4482 8.0459C22.7311 8.18555 22.9692 8.38607 23.1626 8.64746C23.356 8.90527 23.501 9.2168 23.5977 9.58203C23.6943 9.94368 23.7427 10.3465 23.7427 10.7905ZM22.4482 10.9033V10.7905C22.4482 10.522 22.4232 10.2731 22.373 10.0439C22.3229 9.8112 22.2441 9.6071 22.1367 9.43164C22.0293 9.25618 21.8914 9.12012 21.7231 9.02344C21.5584 8.92318 21.3597 8.87305 21.127 8.87305C20.8978 8.87305 20.7008 8.91243 20.5361 8.99121C20.3714 9.06641 20.2336 9.17204 20.1226 9.30811C20.0116 9.44417 19.9256 9.60352 19.8647 9.78613C19.8039 9.96517 19.7609 10.1603 19.7358 10.3716V11.4136C19.7788 11.6714 19.8522 11.9077 19.9561 12.1226C20.0599 12.3374 20.2067 12.5093 20.3965 12.6382C20.5898 12.7635 20.8369 12.8262 21.1377 12.8262C21.3704 12.8262 21.5692 12.776 21.7339 12.6758C21.8986 12.5755 22.0329 12.4377 22.1367 12.2622C22.2441 12.0832 22.3229 11.8773 22.373 11.6445C22.4232 11.4118 22.4482 11.1647 22.4482 10.9033ZM24.5967 10.9087V10.7852C24.5967 10.3662 24.6576 9.9777 24.7793 9.61963C24.901 9.25798 25.0765 8.94466 25.3057 8.67969C25.5384 8.41113 25.8213 8.20345 26.1543 8.05664C26.4909 7.90625 26.8704 7.83105 27.293 7.83105C27.7191 7.83105 28.0986 7.90625 28.4316 8.05664C28.7682 8.20345 29.0529 8.41113 29.2856 8.67969C29.5184 8.94466 29.6956 9.25798 29.8174 9.61963C29.9391 9.9777 30 10.3662 30 10.7852V10.9087C30 11.3276 29.9391 11.7161 29.8174 12.0742C29.6956 12.4323 29.5184 12.7456 29.2856 13.0142C29.0529 13.2791 28.77 13.4868 28.437 13.6372C28.104 13.784 27.7262 13.8574 27.3037 13.8574C26.8776 13.8574 26.4963 13.784 26.1597 13.6372C25.8267 13.4868 25.5438 13.2791 25.311 13.0142C25.0783 12.7456 24.901 12.4323 24.7793 12.0742C24.6576 11.7161 24.5967 11.3276 24.5967 10.9087ZM25.8911 10.7852V10.9087C25.8911 11.1701 25.918 11.4172 25.9717 11.6499C26.0254 11.8826 26.1095 12.0868 26.2241 12.2622C26.3387 12.4377 26.4855 12.5755 26.6646 12.6758C26.8436 12.776 27.0566 12.8262 27.3037 12.8262C27.5436 12.8262 27.7513 12.776 27.9268 12.6758C28.1058 12.5755 28.2526 12.4377 28.3672 12.2622C28.4818 12.0868 28.5659 11.8826 28.6196 11.6499C28.6769 11.4172 28.7056 11.1701 28.7056 10.9087V10.7852C28.7056 10.5273 28.6769 10.2839 28.6196 10.0547C28.5659 9.82194 28.48 9.61605 28.3618 9.43701C28.2472 9.25798 28.1004 9.11833 27.9214 9.01807C27.7459 8.91423 27.5365 8.8623 27.293 8.8623C27.0495 8.8623 26.8382 8.91423 26.6592 9.01807C26.4837 9.11833 26.3387 9.25798 26.2241 9.43701C26.1095 9.61605 26.0254 9.82194 25.9717 10.0547C25.918 10.2839 25.8911 10.5273 25.8911 10.7852ZM32.4707 7.93848V13.75H31.1709V7.93848H32.4707ZM31.085 6.41309C31.085 6.21615 31.1494 6.05322 31.2783 5.92432C31.4108 5.79183 31.5934 5.72559 31.8262 5.72559C32.0553 5.72559 32.2362 5.79183 32.3687 5.92432C32.5011 6.05322 32.5674 6.21615 32.5674 6.41309C32.5674 6.60645 32.5011 6.76758 32.3687 6.89648C32.2362 7.02539 32.0553 7.08984 31.8262 7.08984C31.5934 7.08984 31.4108 7.02539 31.2783 6.89648C31.1494 6.76758 31.085 6.60645 31.085 6.41309ZM35.1724 9.1792V13.75H33.8779V7.93848H35.0972L35.1724 9.1792ZM34.9414 10.6294L34.5225 10.624C34.526 10.2122 34.5833 9.83447 34.6943 9.49072C34.8089 9.14697 34.9665 8.85156 35.167 8.60449C35.3711 8.35742 35.6146 8.16764 35.8975 8.03516C36.1803 7.89909 36.4954 7.83105 36.8428 7.83105C37.1221 7.83105 37.3745 7.87044 37.6001 7.94922C37.8293 8.02441 38.0244 8.14795 38.1855 8.31982C38.3503 8.4917 38.4756 8.71549 38.5615 8.99121C38.6475 9.26335 38.6904 9.59814 38.6904 9.99561V13.75H37.3906V9.99023C37.3906 9.71094 37.3494 9.49072 37.2671 9.32959C37.1883 9.16488 37.0719 9.0485 36.918 8.98047C36.7676 8.90885 36.5796 8.87305 36.354 8.87305C36.132 8.87305 35.9333 8.9196 35.7578 9.0127C35.5824 9.10579 35.4338 9.23291 35.312 9.39404C35.1938 9.55518 35.1025 9.74137 35.0381 9.95264C34.9736 10.1639 34.9414 10.3895 34.9414 10.6294ZM42.6758 7.93848V8.88379H39.3994V7.93848H42.6758ZM40.3447 6.51514H41.6392V12.144C41.6392 12.3231 41.6642 12.4609 41.7144 12.5576C41.7681 12.6507 41.8415 12.7134 41.9346 12.7456C42.0277 12.7778 42.1369 12.7939 42.2622 12.7939C42.3517 12.7939 42.4377 12.7886 42.52 12.7778C42.6024 12.7671 42.6686 12.7563 42.7188 12.7456L42.7241 13.7339C42.6167 13.7661 42.4914 13.7948 42.3481 13.8198C42.2085 13.8449 42.0474 13.8574 41.8647 13.8574C41.5675 13.8574 41.3044 13.8055 41.0752 13.7017C40.846 13.5942 40.667 13.4206 40.5381 13.1807C40.4092 12.9408 40.3447 12.6221 40.3447 12.2246V6.51514Z" fill="#4D1C9A"/>
                              </svg>
                              {getTopicBadge(q.text) && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full border border-[#E8E6E1] bg-[#E3F5E3] text-[11px] font-semibold text-[#586D4D]">
                                  {getTopicBadge(q.text)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <FormatPill label={q.type} />
                          )}
                        </div>
                      </div>

                      <h4 className="font-['Inter'] font-medium text-[16px] leading-[26px] align-middle text-slate-800">
                        {q.text}
                      </h4>

                      {q.type === "Open-ended" && (
                        <div className="mt-2 border-t border-[#E8E6E1]" />
                      )}

                      {q.type === "Rating" && (
                        <div className="pt-[6px] mt-1 border-t border-[#E8E6E1]">
                          <p className="font-['Roboto'] font-normal text-[13px] leading-[19.5px] align-middle text-slate-500">
                            Scored: Yes · Sometimes · No
                          </p>
                        </div>
                      )}

                      {q.choices && q.choices.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap pt-[10px] mt-1 border-t border-[#E8E6E1]">
                          {q.choices.map((choice, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center justify-center h-[28px] pt-[5px] pr-[11px] pb-[5px] pl-[11px] rounded-[8px] border border-[#E8E6E1] bg-[#FAF9F6] text-[11px] font-semibold text-slate-600"
                            >
                              {choice}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right pane: sidebar */}
        <div className="w-full lg:w-[280px] shrink-0 space-y-3">

          {/* Box 1 — Version summary */}
          <div className="bg-white border border-[#E8E6E1] w-full h-auto min-h-[256.5px] rounded-[16px] border-[1px] p-[21px] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <h3 className="text-[13px] text-slate-400 font-medium font-sans mb-4">Version summary</h3>
            <div className="space-y-0">
              <div className="flex items-center justify-between py-2">
                <span className="text-[13px] text-slate-500">Grade band</span>
                <GradeBadge band={instrument.gradeBand} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[13px] text-slate-300">Version</span>
                <span className="text-[13px] text-slate-400">v3</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[13px] text-slate-500">Status</span>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-semibold bg-[#E8F5E9] text-[#2E7D32]">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[13px] text-slate-300">Provided</span>
                <span className="text-[13px] text-slate-400">2025-08-12</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[13px] text-slate-500">Provided by</span>
                <span className="text-[13px] font-bold text-slate-800 text-right max-w-[130px] leading-tight">SFWG Curriculum Team</span>
              </div>
            </div>
          </div>

          {/* Box 2 — Question breakdown */}
          <div className="bg-white border border-[#E8E6E1] w-full h-auto min-h-[259.5px] rounded-[16px] border-[1px] p-[21px] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <h3 className="text-[13px] text-slate-400 font-medium font-sans mb-3">Question breakdown</h3>
            <div className="flex flex-col items-center justify-center py-3 mb-4">
              <span className="text-[42px] font-bold text-slate-800 leading-none">22</span>
              <span className="text-[12px] text-slate-400 mt-1">Total questions</span>
            </div>
            <div className="space-y-0">
              {[
                { label: "3-point rating", count: 11, color: "#4D1C9A" },
                { label: "Single-select",  count: 8,  color: "#8A4B04" },
                { label: "Multi-select",   count: 2,  color: "#1A5C7A" },
                { label: "Open-ended",     count: 1,  color: "#9CA3AF" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2">
                  <span className="flex items-center gap-2 text-[13px] text-slate-600">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </span>
                  <span className="text-[13px] text-slate-500">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Box 3 — Concept mapping */}
          <div className="bg-white border border-[#E8E6E1] w-full h-auto min-h-[293.5px] rounded-[16px] border-[1px] p-[21px] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <h3 className="text-[13px] text-slate-400 font-medium font-sans mb-3">Concept mapping</h3>
            <div className="space-y-0">
              {[
                { label: "Taste",        count: 2 },
                { label: "Freshness",    count: 2 },
                { label: "Variety",      count: 2 },
                { label: "Staff",        count: 1 },
                { label: "Cleanliness",  count: 1 },
                { label: "Time to eat",  count: 2 },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2">
                  <span className="text-[13px] text-slate-700">{item.label}</span>
                  <span className="text-[13px] text-slate-500">{item.count}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
              Concept mapping is defined by the client and cannot be edited here.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function AdminSurveysPage() {
  const [viewingInstrument, setViewingInstrument] = useState<SurveyInstrument | null>(null);
  
  const handleSetViewingInstrument = (instrument: SurveyInstrument | null) => {
    setViewingInstrument(instrument);
    if (instrument) {
      sessionStorage.setItem("viewingInstrumentTitle", "View instrument");
    } else {
      sessionStorage.removeItem("viewingInstrumentTitle");
    }
    window.dispatchEvent(new Event("view-instrument-change"));
  };

  const [search, setSearch] = useState("");
  const [gradeBandFilter, setGradeBandFilter] = useState("All");
  const [versionStatusFilter, setVersionStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Grade band");

  const filtered = useMemo(() => {
    let result = [...INSTRUMENTS];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q));
    }

    if (gradeBandFilter !== "All") {
      result = result.filter((i) => i.gradeBand === gradeBandFilter);
    }

    if (versionStatusFilter === "Has active versions") {
      result = result.filter((i) => i.activeVersionCount > 0);
    } else if (versionStatusFilter === "Has retired versions") {
      result = result.filter((i) => i.retiredVersionCount > 0);
    }

    if (sortOrder === "Grade band") {
      const order: Record<string, number> = { "K-5": 0, "6-8": 1, "9-12": 2 };
      result.sort((a, b) => (order[a.gradeBand] ?? 9) - (order[b.gradeBand] ?? 9));
    } else if (sortOrder === "Most questions") {
      result.sort((a, b) => b.questions - a.questions);
    } else if (sortOrder === "Most schools") {
      result.sort((a, b) => b.schoolsUsing - a.schoolsUsing);
    }

    return result;
  }, [search, gradeBandFilter, versionStatusFilter, sortOrder]);

  if (viewingInstrument) {
    return (
      <ViewInstrumentView
        instrument={viewingInstrument}
        onBack={() => handleSetViewingInstrument(null)}
        onChangeInstrument={handleSetViewingInstrument}
      />
    );
  }

  return (
    <div className="space-y-5 w-full pb-10">

      {/* Client-authored notice banner */}
      <div className="flex items-start gap-3 bg-[#F5F3FF] border border-[#DDD6FE] rounded-xl px-4 py-3.5">
        <Info className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-[#5B21B6]">
            Survey instruments are authored and provided by the client and cannot be edited here.
          </p>
          <p className="text-[12px] text-[#7C3AED] mt-0.5">
            View each instrument, manage versions, disable individual questions, and preview the student experience.
            For changes to question text, type, or options, submit a request through the client process.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

        {/* Left: search + filter pills */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search */}
          <div className="relative shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search instruments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 border border-[#E8E6E1] bg-white rounded-full text-[13px] placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300 w-[200px]"
            />
          </div>

          {/* Grade band filter */}
          <FilterDropdown
            label="Grade band"
            options={[
              { value: "All", label: "All" },
              { value: "K-5", label: "K–5" },
              { value: "6-8", label: "6–8" },
              { value: "9-12", label: "9–12" },
            ]}
            value={gradeBandFilter}
            onChange={setGradeBandFilter}
            className="shrink-0"
          />

          {/* Version status filter */}
          <FilterDropdown
            label="Version status"
            options={[
              { value: "All", label: "All" },
              { value: " Active", label: "Active" },
              { value: "Retired", label: "Retired" },
            ]}
            value={versionStatusFilter}
            onChange={setVersionStatusFilter}
            className="shrink-0"
          />
        </div>

        {/* Right: Sort */}
        <FilterDropdown
          label="Sort"
          options={[
            { value: "Grade band", label: "Grade band" },
            { value: "Recently Updated ", label: "Recently Updated" },
            
          ]}
          value={sortOrder}
          onChange={setSortOrder}
          className="shrink-0 [&>button]:border-[#D8B4FE] [&>button]:bg-[#FAF5FF] [&>button]:hover:bg-[#F3E8FF] [&>button_svg]:!text-[#6D28D9] [&>button_.text-slate-400]:!text-[#A78BFA] [&>button_span+span]:!text-[#6D28D9] [&>button_span+span]:font-bold"
        />
      </div>

      {/* Instrument Cards */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-[14px] font-semibold text-slate-600">No instruments found</p>
            <p className="text-[13px] text-slate-400 mt-1">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          filtered.map((instrument) => (
            <InstrumentCard 
              key={instrument.id} 
              instrument={instrument} 
              onViewInstrument={() => handleSetViewingInstrument(instrument)}
            />
          ))
        )}
      </div>
    </div>
  );
}
