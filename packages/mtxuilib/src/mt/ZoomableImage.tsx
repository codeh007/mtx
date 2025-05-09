import clsx from "clsx";
import { useEffect, useState } from "react";

type HTMLImageElementProps = React.ComponentProps<"img">;

function ZoomableImage(props: HTMLImageElementProps) {
	const [modalOpen, setModalOpen] = useState(false);
	const [zoom, setZoom] = useState(false);

	const openModal = () => {
		setZoom(false);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		function handleEscKey(e: KeyboardEvent) {
			if (modalOpen && e.key === "Escape") {
				closeModal();
			}
		}
		document.addEventListener("keydown", handleEscKey);
		return () => {
			document.removeEventListener("keydown", handleEscKey);
		};
	}, [modalOpen]);

	return (
		<div>
			{/* biome-ignore lint/a11y/useAltText: <explanation> */}
			<img
				{...props}
				onClick={openModal}
				className={clsx("cursor-zoom-in object-contain", props.className)}
			/>
			{modalOpen && (
				<div
					className={clsx(
						"fixed inset-0 z-50 flex justify-center overflow-auto bg-black bg-opacity-75 p-16",
						{
							"items-center": !zoom,
							"items-baseline": zoom,
						},
					)}
				>
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<span
						className="absolute right-4 top-4 cursor-pointer text-4xl text-white"
						onClick={closeModal}
					>
						&times;
					</span>
					{/* biome-ignore lint/a11y/useAltText: <explanation> */}
					<img
						{...props}
						onClick={() => setZoom(!zoom)}
						className={clsx({
							"m-0 h-full max-h-full min-h-full w-full max-w-full cursor-zoom-in object-contain":
								!zoom,
							"m-0 ml-auto mr-auto max-h-none min-h-full max-w-none cursor-zoom-out object-contain":
								zoom,
						})}
					/>
				</div>
			)}
		</div>
	);
}

export { ZoomableImage };
