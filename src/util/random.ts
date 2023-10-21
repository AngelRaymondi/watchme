export default {
	array: <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)],
	number: (from: number, to: number): number => {
		let n = Math.floor(Math.random() * (to + 1 - from) + from)
		return n;
	},
	prob: (fraction: number): Boolean => {
		let n = Math.floor(Math.random() * (100 + 1) + 0)
		return (fraction * 100) >= n;
	}
}