import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { FileText, FolderOpen, Upload, Cloud, LogOut } from "lucide-react";
import bexex from "../../assests/Bexex-logo-white.png";
import backImage from "../../assests/background-image.png";

interface DashboardProps {
  onNavigate: (
    view: "dashboard" | "new-report" | "submitted-reports" | "upload-project"
  ) => void;
  onLogout: () => void;
}

export default function Dashboard({ onNavigate, onLogout }: DashboardProps) {
  const menuItems = [
    {
      id: "new-report" as const,
      title: "NEW REPORT",
      description: "Start a new audit report",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      id: "submitted-reports" as const,
      title: "SUBMITTED REPORTS",
      description: "View all submitted audit reports",
      icon: FolderOpen,
      color: "bg-green-500",
    },
    {
      id: "upload-project" as const,
      title: "UPLOAD PROJECT DATA",
      description: "Add new project information",
      icon: Upload,
      color: "bg-purple-500",
    },
    {
      id: "sync" as const,
      title: "SYNC TO SERVER",
      description: "Synchronize local data with server",
      icon: Cloud,
      color: "bg-orange-500",
    },
  ];

  const handleClick = (id: string) => {
    if (id === "sync") {
      // Handle sync functionality
      alert("Sync functionality will synchronize local data with server");
    } else {
      onNavigate(id as "new-report" | "submitted-reports" | "upload-project");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,10), rgba(248, 250, 249, .7)), url(${backImage})`,
        backgroundSize: "100vw",
        backgroundRepeat: "no-repeat",
        opacity: "20",
        backgroundPosition: "center bottom",
      }}
      className="min-h-screen "
    >
      <div className="container mx-auto p-6">
        {/* large */}
        {/* <div className="flex justify-center w-full mb-5.5 ">
          <img src={bexex} width={150} alt="Bexex Logo" />
        </div> */}


        <div className="flex flex-col-reverse sm:flex-row justify-between items-start mb-8 rounded-2xl p-5 bg-gradient-to-r from-[#57664C] to-[#6B8E7D]">
          <div >
            {/* <h1 className="text-white text-2xl sm:text-2xl md:text-3xl lg:text-4xl">
              Audit Management Dashboard
            </h1>
            <p className="text-white/80">
              Welcome back! Select an option to continue
            </p> */}
          <img src={bexex} width={150} alt="Bexex Logo" />
            

          </div>
          <Button className=" h-full" variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2 bg-white/10 backdrop-blur-sm" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleClick(item.id)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`${item.color} p-2 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {item.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
