import { useEffect, useState } from "react";
import "./Chip.css"
import { IoClose } from "react-icons/io5";

const predefinedItems = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig","Soap","Perfume","Sugar","Salt","Noodles","Tissues"];

function Chip() {

    // State to store all the chips
    const [data,setData] = useState([]); 

    // State to store the index of the selected chip on backspace
    const [selectedData,setSelectedData] = useState(null); 
    
    // State to store the index of the selected search item on keyboard arrow direction
    const [selectedDataSearch,setSelectedDataSearch] = useState(0); 
    
    // State to trigger showing search items on input focus
    const [showSearchItem, setShowSearchItem] = useState(false); 

    // State to store all the filter items while searching
    const [filterItem, setFilterItem] = useState(predefinedItems);

    // Update filter items based on selected chips
    useEffect(() => {
        const updateFilter = predefinedItems.filter(
            (item) => !data.some((selectedItem) => selectedItem.toLowerCase() === item.toLowerCase())
        );
        setFilterItem(updateFilter);
    }, [data]);
    

    // Function to handle Enter, ArrowUp, and ArrowDown key presses
    const handleKeyDown = (e) =>{
        if (e.key === "Enter") {
            const selectedSearchItem = filterItem[selectedDataSearch];
            setData((prevData) => [...prevData, selectedSearchItem]);
            e.target.value = ''; // Clear the input field
            setSelectedDataSearch(0); // Reset selected search item
        }

        else if(e.key === "ArrowDown"){
            setSelectedDataSearch((prevdata) => Math.min(prevdata+1,filterItem.length-1))
        }
        else if(e.key === "ArrowUp"){
            setSelectedDataSearch((prevdata) => Math.max(prevdata-1,0))
        }

    }

    // Function to handle Backspace key press
    const handleKeyUp = (e) => {
        if (e.key === "Backspace" && !e.target.value && data.length > 0 && selectedData === null) {
          setSelectedData(data.length-1);
        }
        else if (e.key === "Backspace" && selectedData !== null){
            handleRemove(selectedData)
            setSelectedData(null)
        }
        else{
            setSelectedData(null)
        }
    };

    // Function to remove the selected item from the state
    const handleRemove = (index) =>{
        setData(data.filter((item,i)=> i !== index))
    }

    // Function to hide search items when input loses focus
    const handleInputBlur = () => {
        setShowSearchItem(false);
    };

    // Function to handle input change and filter search items
    const handleChange = (e) =>{
        if(e.target.value.toLowerCase()===""){
            const updateFilter = predefinedItems.filter(
                (item) => !data.some((selectedItem) => selectedItem.toLowerCase() === item.toLowerCase())
            );
            setFilterItem(updateFilter);
        }else{
            const value = e.target.value.toLowerCase();
            const filteredByValue = filterItem.filter((item) => item.toLowerCase().includes(value));
            setFilterItem(filteredByValue)   
        }
    }

    // Function to handle click on search items
    const handleSearchItemClick = (item) =>{
        setData(prevdata => [...prevdata,item]);
    }

    // Scroll the selected search item into view
    const selectedItem = document.querySelector(`.searchItem.selectedSearch`);
    if (selectedItem) {
        selectedItem.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }
  return (
    <div className="chip">
        <h1>Enter Grocery</h1>
        <div className="chip-container">
            {data.map((item,index)=>(
                <div className={`chip-item ${selectedData === index ? "selected" : ""}`} key={index}>
                    <span className="chip-text">
                        {item}
                    </span>
                    <span className="chip-close-icon" onClick={()=>handleRemove(index)}>
                        <IoClose />
                    </span>
                </div>
            ))}
            <input 
                type="text" 
                className="chip-input" 
                placeholder="Search..."  
                onKeyUp={handleKeyUp} 
                onKeyDown={handleKeyDown}
                onFocus={()=>setShowSearchItem(true)}
                onBlur={handleInputBlur}
                onChange={handleChange}
            />
            {showSearchItem && (
                <div className="showSearchItems-Container">
                    {filterItem.map((item,index)=>(
                        <div 
                            key={index} 
                            className = {`searchItem ${selectedDataSearch === index ? "selectedSearch":""}`}
                            onMouseDown={() => handleSearchItemClick(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  )
}

export default Chip
