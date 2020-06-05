module tui

go 1.14
replace a-module => ./../a-module

require (
	a-module v0.0.0-00010101000000-000000000000
    github.com/gizak/termui/v3 v3.1.0
)
