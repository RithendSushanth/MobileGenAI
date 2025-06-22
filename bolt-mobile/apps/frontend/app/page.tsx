// import { Prompt } from "@/components/Prompt";
// import { ProjectsDrawer } from "@/components/ProjectsDrawer";
// import SideInfo from "@/components/SideInfo";
// import { Appbar } from "@/components/Appbar";

// export default function Home() {
//   return (
//     <div>
//       <Appbar />
//       <div className="p-4 md:pt-8">
//         <ProjectsDrawer />
//         <div className="max-w-2xl mx-auto pt-32 md:pt-52">
//           <div className="text-5xl font-bold text-center">
//             What do you want to build?
//           </div>
//           <div className="font-space-grotesk text-muted-foreground text-center p-2">
//             Prompt, click generate and watch your app come to life
//           </div>
//           <div className="pt-4">
//             <Prompt />
//           </div>
//         </div>
//     </div>
//    </div>
//   );
// }



import { Prompt } from "@/components/Prompt"
import { ProjectsDrawer } from "@/components/ProjectsDrawer"
import { Appbar } from "@/components/Appbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Appbar />
      <div className="p-4 md:pt-8">
        <ProjectsDrawer />
        <div className="max-w-2xl mx-auto pt-32 md:pt-52">
          <div className="text-5xl font-bold text-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            What do you want to build?
          </div>
          <div className="font-space-grotesk text-muted-foreground text-center p-2 text-lg">
            Prompt, click generate and watch your app come to life
          </div>
          <div className="pt-6">
            <Prompt />
          </div>

          {/* Optional: Add some visual elements */}
          {/* <div className="flex justify-center items-center space-x-2 mt-8 opacity-60">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-150"></div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
