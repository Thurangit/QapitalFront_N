import { StaticsImages } from '../../modules/images';

export const ProfileHeader = ({ name, surname, profileImage }) => (
    <div className="relative p-6 mb-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between  py-2 pt-8">
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{name}</h1>
                <p className="text-right text-gray-600 text-0">{surname}</p>
            </div>
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <img
                    src={StaticsImages.avatar || "/api/placeholder/100/100"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    </div>
);