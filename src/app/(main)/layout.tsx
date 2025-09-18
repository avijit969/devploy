import NavBar from "@/components/nav-bar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <NavBar />
            {children}
        </div>
    );
};

export default DashboardLayout;
