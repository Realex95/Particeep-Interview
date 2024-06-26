import React, { useEffect, useState } from 'react';
import Select, { MultiValue} from 'react-select';

interface OptionType {
    value: string;
    label: string;
}

interface CategoryFilterProps {
    loadCategories: () => Promise<OptionType[]>;
    selectedCategories: string[];
    onChange: (selectedOptions: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ loadCategories, selectedCategories, onChange }) => {
    const [options, setOptions] = useState<OptionType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await loadCategories();
            setOptions(categories);
            setIsLoading(false);
        };

        fetchCategories();
    }, [loadCategories]);

    const handleChange = (selectedOptions: MultiValue<OptionType>) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        onChange(selectedValues);
    };

    return (
        <Select
            isMulti
            isLoading={isLoading}
            options={options}
            value={options.filter(option => selectedCategories.includes(option.value))}
            onChange={handleChange}
            placeholder="Sélectionner des catégories"
            noOptionsMessage={() => "Aucune catégorie disponible"}
        />
    );
};

export default CategoryFilter;
