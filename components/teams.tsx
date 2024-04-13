import { ScrollArea } from "./ui/scroll-area";
import AddTeam from "./add-team";
import SpreadTeam from "./spread-team";
import { Session } from "next-auth";

interface TeamsProps {
    teamData: ({
        id: string;
        adminName: string;
        members: {
            TeamId: string;
            name: string;
            email: string;
            image: string;
            status: string;
        }[];
    } & {
        userId: string;
        teamName: string;
        teamIcon: string;
    })[]
    session: Session | null,
}

const Teams: React.FC<TeamsProps> = ({
    teamData,
    session
}) => {

    const filteredTeams = teamData.filter((data) =>
        data.members.some(
            (member) => member.status === "MEMBER" || data.userId === session?.user.userId
        )
    );

    return (
        <div>
            <h1 className="text-[12px] text-gray-500 font-extrabold uppercase ml-2">Teams</h1>
            <ScrollArea>
                {/* if viewed, i will show Team Name, Team Members, Team Task, Member Analytics  */}
                <div className="flex flex-col item-center mt-2 max-h-36 space-y-1">
                    {filteredTeams.map((data, index) => (
                        <SpreadTeam key={index} teamData={data} session={session} />
                    ))}
                    <AddTeam session={session} />
                </div>
            </ScrollArea>
        </div>
    )
}

export default Teams;