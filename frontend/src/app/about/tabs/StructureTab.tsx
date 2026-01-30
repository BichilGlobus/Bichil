'use client';

export default function StructureTab() {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* Intro Text */}
       <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Зохион байгуулалтын бүтэц</h2>
           <p className="text-gray-600 text-lg leading-relaxed">
               Компанийн үйл ажиллагааг үр ашигтай явуулах, харилцагчдад түргэн шуурхай үйлчлэх зорилгоор зохион байгуулалтын оновчтой бүтцийг бүрдүүлэн ажиллаж байна.
           </p>
       </div>

        {/* Organization Chart */}
       <div className="overflow-x-auto pb-8">
           <div className="min-w-[800px] flex flex-col items-center">
               
               {/* CEO Node */}
                <div className="w-64 bg-teal-600 text-white rounded-xl p-4 shadow-lg text-center relative mb-12 z-10">
                    <h3 className="font-bold text-lg">Гүйцэтгэх захирал</h3>
                   <div className="absolute bottom-0 left-1/2 w-0.5 h-12 bg-gray-300 translate-y-full transform -translate-x-1/2"></div>
                </div>

                {/* Level 2 Container */}
                <div className="flex justify-between w-full relative px-4">
                     {/* Horizontal Connecting Line */}
                     <div className="absolute top-0 left-16 right-16 h-0.5 bg-gray-300 -translate-y-0.5"></div>

                     {/* Department Nodes */}
                     {[
                         'Бизнес хөгжлийн газар',
                         'Санхүү удирдлагын газар',
                         'Зээлийн үйл ажиллагааны газар',
                         'Эрсдэлийн удирдлагын газар',
                         'Хүний нөөц, захиргааны газар',
                         'Мэдээллийн технологийн газар'
                     ].map((dept, index) => (
                        <div key={index} className="flex flex-col items-center relative pt-8 mx-2">
                             {/* Vertical Connector from Top Line */}
                             <div className="absolute top-0 w-0.5 h-8 bg-gray-300"></div>
                             
                             <div className="w-40 bg-white border-2 border-teal-100 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-teal-300 transition-all text-center group cursor-default">
                                  <h4 className="text-sm font-semibold text-gray-800 group-hover:text-teal-700">{dept}</h4>
                             </div>
                        </div>
                     ))}
                </div>
           </div>
       </div>

    </div>
  );
}