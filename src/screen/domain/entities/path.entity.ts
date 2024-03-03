export enum Path {
	Game = 'game',
	Help = 'help',
	Home = 'home',
	NotFound = 'not-found',
}

export const IDLE_PATH = Path.Home

export const SIMPLE_PATHS = [Path.Home, Path.NotFound]

export const PATHS = Object.values(Path)

export const COMPLEX_PATHS = PATHS.filter(path => !SIMPLE_PATHS.includes(path))
