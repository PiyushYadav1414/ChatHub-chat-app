import { Users } from "lucide-react"; // Importing an icon to represent users in the sidebar

const SidebarSkeleton = () => {
  // Create an array of 8 empty items to simulate the loading state of contacts.
  // This will be used to show placeholders (skeletons) while the actual data loads.
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-20 lg:w-72 border-r border-base-300 
    flex flex-col transition-all duration-200"
    >
      {/* Sidebar Header Section */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          {/* Displaying a 'Users' icon from lucide-react */}
          <Users className="w-6 h-6" />
          {/* Displaying the 'Contacts' label on larger screens */}
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      {/* Section for displaying skeleton (loading) contacts */}
      <div className="overflow-y-auto w-full py-3">
        {/* We loop through the skeletonContacts array to create placeholders for the contacts */}
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            {/* Avatar Skeleton Placeholder: Simulating the user profile image */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full" /> {/* Skeleton for avatar */}
            </div>

            {/* User Info Skeleton Placeholder: Displayed only on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              {/* Skeleton for the user's name - Placeholder */}
              <div className="skeleton h-4 w-32 mb-2" />
              {/* Skeleton for the user's status (e.g., online/offline) - Placeholder */}
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
