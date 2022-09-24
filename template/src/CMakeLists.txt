add_executable(AWESOME_CPP_CMAKE_NAME
  ../main.cpp
  # add more cpp files to compile!
  # ej. game.cpp
)
target_compile_features(AWESOME_CPP_CMAKE_NAME PUBLIC cxx_std_17)
set_target_properties(AWESOME_CPP_CMAKE_NAME PROPERTIES CXX_EXTENSIONS OFF)

if (${CMAKE_CXX_COMPILER_ID} STREQUAL "MSVC")
	set(MY_DEBUG_OPTIONS /Wall /RTC)
	set(MY_RELEASE_OPTIONS /w3 /O2)
	target_compile_options(AWESOME_CPP_CMAKE_NAME PUBLIC "$<$<CONFIG:DEBUG>:${MY_DEBUG_OPTIONS}>")
	target_compile_options(AWESOME_CPP_CMAKE_NAME PUBLIC "$<$<CONFIG:RELEASE>:${MY_RELEASE_OPTIONS}>")

elseif (${CMAKE_CXX_COMPILER_ID} STREQUAL "GNU")
	set(MY_DEBUG_OPTIONS -Wall -Wconversion -Wdouble-promotion -Weffc++ -Wextra -Wfloat-equal -Wmain -Wshadow -fstack-usage -pedantic -g3)
	set(MY_RELEASE_OPTIONS -O2)
	target_compile_options(AWESOME_CPP_CMAKE_NAME PUBLIC "$<$<CONFIG:DEBUG>:${MY_DEBUG_OPTIONS}>")
	target_compile_options(AWESOME_CPP_CMAKE_NAME PUBLIC "$<$<CONFIG:RELEASE>:${MY_RELEASE_OPTIONS}>")

elseif (${CMAKE_CXX_COMPILER_ID} STREQUAL "Clang")
	set(MY_DEBUG_OPTIONS -Wall -Wconversion -Wdouble-promotion -Weffc++ -Wextra -Wfloat-equal -Wmain -Wshadow -pedantic -g3)
	set(MY_RELEASE_OPTIONS -O2)
	target_compile_options(AWESOME_CPP_CMAKE_NAME PUBLIC "$<$<CONFIG:DEBUG>:${MY_DEBUG_OPTIONS}>")
	target_compile_options(AWESOME_CPP_CMAKE_NAME PUBLIC "$<$<CONFIG:RELEASE>:${MY_RELEASE_OPTIONS}>")
endif()

if(DEFINED CMAKE_TOOLCHAIN_FILE)
  target_link_libraries(AWESOME_CPP_CMAKE_NAME PRIVATE
    # add needed libraries
    # like: sfml-system
  )
else()
  # DO YOUR OWN
endif()

install(TARGETS AWESOME_CPP_CMAKE_NAME RUNTIME DESTINATION ${BIN_DIR})
