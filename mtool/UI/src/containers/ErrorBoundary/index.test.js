import React from "react";
import ErrorBoundary from "./index";
import {
    render,
    fireEvent,
    cleanup,
    waitForElement,
    wait,
  } from "@testing-library/react";


it('should show error message on throwing error', () => {
    const ErrorChild = () => {
        throw new Error("Testing error");
        return (
            <div>Error</div>
        )
    };
    const wrapper = render(
        <ErrorBoundary>
            <ErrorChild />
        </ErrorBoundary>
    );

    const {getAllByText} = wrapper;

    expect(getAllByText('UI crashed... Please reload the page')).toBeDefined();


})