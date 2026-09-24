import { ArchQuestMark } from '@/components/brand/ArchQuestMark'

export function ArchQuestWordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <ArchQuestMark />
      <span className="font-display text-lg font-semibold tracking-[-0.02em] font-stretch-112%">
        archQuest
      </span>
    </span>
  )
}
