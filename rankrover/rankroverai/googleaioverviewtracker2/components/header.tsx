import Image from "next/image"

export function Header() {
  return (
    <header className="w-full border-b bg-[#F9F9FA]" style={{ height: "100px" }}>
      <div className="container mx-auto h-full px-8 flex items-center">
        <div className="flex items-center">
          <Image src="/images/rover-logo.svg" alt="RankRover Logo" width={100} height={100} className="mr-4" />
          <div className="font-heading text-2xl font-extrabold">
            <span style={{ color: "#2196F3" }}>RANK</span>
            <span style={{ color: "#B5B5B6" }}>ROVER.AI</span>
          </div>
        </div>
      </div>
    </header>
  )
}
