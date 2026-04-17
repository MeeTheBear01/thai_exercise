import Link from "next/link";

const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
            <p className="text-lg text-gray-600 mb-8">This is the main page of the application.</p>
            <Link href="/character">
                <button className="btn btn-primary px-8 py-2 text-xl">เริ่มเกม</button>
            </Link>
        </div>
    );
}
export default HomePage;