"use client";

import { Flipbook } from "./turn-2";

export function StickyNotes2Block() {
  return (
    <Flipbook
      width={400}
      height={300}
      duration={600}
      cornerSize={100}
      gradients={true}
      onPageChange={(page) => console.log("Page changed to:", page)}
    >
      {/* Page 1 */}
      <div className="flex h-full w-full items-center justify-center bg-yellow-200 p-4">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-yellow-800">Page 1</h2>
          <p className="text-yellow-700">
            Drag the bottom-right corner to flip
          </p>
        </div>
      </div>

      {/* Page 2 */}
      <div className="flex h-full w-full items-center justify-center bg-blue-200 p-4">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-blue-800">Page 2</h2>
          <p className="text-blue-700">Keep flipping to see more pages</p>
        </div>
      </div>

      {/* Page 3 */}
      <div className="flex h-full w-full items-center justify-center bg-purple-200 p-4">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-purple-800">Page 3</h2>
          <p className="text-purple-700">Almost there!</p>
        </div>
      </div>

      {/* Page 4 */}
      <div className="flex h-full w-full items-center justify-center bg-pink-200 p-4">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-pink-800">Page 4</h2>
          <p className="text-pink-700">Last page - all done!</p>
        </div>
      </div>
    </Flipbook>
  );
}
