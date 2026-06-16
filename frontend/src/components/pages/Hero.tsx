import { useScreenSize } from "../hooks/useWindowSize";


function Hero() {

	const { width, height } = useScreenSize();

	return (
		<>
			<div className="text-center p-3 bg-orange-400 rounded-xl">
				<span>
					Hero Main Section <br />
					Width: {width}  <br />
					Height: {height}  <br />
				</span>
			</div>
		</>
	);
}

export default Hero; 