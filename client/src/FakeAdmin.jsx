export default function FakeAdmin() {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4 text-green-700">
        Admin Panel
      </h1>
      <p className="mb-3 text-gray-700">Welcome, Admin!</p>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="font-bold mb-2">Total Users</h2>
          <p className="text-3xl font-semibold">1,245</p>
        </div>

        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="font-bold mb-2">Transactions</h2>
          <p className="text-3xl font-semibold">₹ 8,24,000</p>
        </div>

        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="font-bold mb-2">Server Status</h2>
          <p className="text-green-700 font-semibold">Running ✔</p>
        </div>

        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="font-bold mb-2">Pending Requests</h2>
          <p className="text-3xl font-semibold">32</p>
        </div>
      </div>
    </div>
  );
}
